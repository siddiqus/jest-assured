import configs from '../../../.jest-assured.config'

import { ApiConfigsMap, ApiProviders, DbConfigsMap } from '../types'

export const apiConfigs: ApiConfigsMap = (configs.providers.api || []).reduce(
  (obj: ApiConfigsMap, apiName: string) => {
    const apiHeadersStr = process.env[`${apiName}_API_HEADERS_JSON`] || '{}'
    let apiHeadersJson: Record<string, any>
    try {
      apiHeadersJson = JSON.parse(apiHeadersStr)
    } catch (error) {
      throw new Error(`Could not parse api header json for ${apiName}`)
    }
    obj[apiName as ApiProviders] = {
      baseUrl: process.env[`${apiName}_API_BASE_URL`] as string,
      headers: apiHeadersJson,
    }
    return obj
  },
  {} as ApiConfigsMap
)

export const dbConfigs: DbConfigsMap = (configs.providers.db || []).reduce(
  (obj: any, ms: any) => {
    obj[ms] = {
      dialect: process.env[`${ms}_DATABASE_DIALECT`] as string,
      database: process.env[`${ms}_DATABASE_NAME`] as string,
      host: process.env[`${ms}_DATABASE_HOST`] as string,
      port: process.env[`${ms}_DATABASE_PORT`] as string,
      username: process.env[`${ms}_DATABASE_USERNAME`] as string,
      password: process.env[`${ms}_DATABASE_PASSWORD`] as string,
    }
    return obj
  },
  {} as any
)
