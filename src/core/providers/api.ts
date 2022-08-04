import axios, { AxiosError, AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'
import EventEmitter from 'events'
import fs from 'fs'
import https from 'https'
import path from 'path'
import { ApiConfig } from '../types'
import { apiConfigs } from './provider-configs'

class UsageMapEmitter extends EventEmitter {}
const usageMapEmitter = new UsageMapEmitter()

usageMapEmitter.on('apiUsage', (usageUrl) => {
  const reportsPath = path.resolve('reports')
  const dataPath = path.resolve('reports', 'api-usage.txt')

  if (!fs.existsSync(reportsPath)) fs.mkdirSync(reportsPath)

  fs.appendFile(
    path.join(dataPath),
    `${usageUrl}\n`,
    {},
    (err) => err && console.error(err)
  )
})

function _createAxios(apiConfig: ApiConfig, name: string): AxiosInstance {
  if (!apiConfig) {
    throw new Error(`config not defined for ${name}`)
  }

  if (!apiConfig.baseUrl) {
    throw new Error(`base url not defined for ${name}`)
  }

  const instance = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: 100000,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    headers: {
      ...(apiConfig.headers ? apiConfig.headers : {}),
      'Content-Type': 'application/json',
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  })

  axiosRetry(instance, { retries: 2 })

  instance.interceptors.request.use((conf) => {
    const apiCall = `${name} ${conf.method} ${conf.url}`
    usageMapEmitter.emit('apiUsage', apiCall)
    return conf
  })

  return instance
}

export const apis: Record<keyof typeof apiConfigs, AxiosInstance> = Object.keys(
  apiConfigs
).reduce(
  (obj, apiServiceKey) => ({
    ...obj,
    [apiServiceKey]: _createAxios(
      (apiConfigs as any)[apiServiceKey],
      apiServiceKey
    ),
  }),
  {} as any
)

export function testApi(opts: {
  description: string
  api: keyof typeof apiConfigs
  url: string
  responseBody: Record<string, any>
  responseStatus: number
  requestBody?: Record<string, any>
  method?: 'get' | 'put' | 'patch' | 'post' | 'delete'
}) {
  const {
    description,
    api,
    url,
    responseStatus,
    responseBody,
    requestBody = {},
    method = 'get',
  } = opts
  it(description, async () => {
    const client = apis[api]
    if (!client) {
      throw new Error('Client is not configured')
    }

    if (responseStatus >= 200 && responseStatus < 300) {
      const res = await client[method](url, requestBody)
      const { data } = res
      expect(data).toEqual(responseBody)
    } else {
      let responseError
      try {
        await client[method](url, requestBody)
      } catch (error) {
        responseError = error
      }

      expect(responseError).toBeDefined()
      expect((responseError as AxiosError).response?.data).toEqual(responseBody)
    }
  })
}
