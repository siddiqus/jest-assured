import fs from 'fs'
import path from 'path'
import { testApi } from './providers/api'

const autoApiFolderPath = path.join(__dirname, '..', 'autoapi')

const suiteNames = fs.readdirSync(autoApiFolderPath)

const configErrors: {
  suiteName: string
  configFile: string
  error: string
}[] = []

const testSuites = suiteNames.map((suiteName) => {
  const suitePath = path.join(autoApiFolderPath, suiteName)
  const configFiles = fs.readdirSync(suitePath)

  const testConfigs = configFiles.map((configFile) => {
    const testCasesPath = path.join(suitePath, configFile)
    const testCases = require(testCasesPath)

    if (
      !testCases.every(
        (testCase: any) =>
          testCase.url &&
          testCase.description &&
          testCase.responseStatus &&
          testCase.responseBody
      )
    ) {
      configErrors.push({
        suiteName,
        configFile,
        error: 'missing one of: description, url, responseStatus, responseBody',
      })
    }

    return {
      fileName: configFile,
      testCases,
    }
  })

  return {
    suiteName,
    testConfigs,
  }
})

if (configErrors.length > 0) {
  console.error('***** Config format error *****')
  configErrors.forEach((er) => {
    console.error(`${er.suiteName}/${er.configFile}: ${er.error}`)
  })
}

testSuites.forEach((testSuite: any) => {
  describe(`Auto: ${testSuite.suiteName}`, () => {
    for (const { fileName, testCases } of testSuite.testConfigs) {
      describe(fileName, () => {
        for (const testCase of testCases) {
          const {
            description,
            api,
            url,
            responseStatus,
            responseBody,
            requestBody,
            method = 'get',
          } = testCase

          testApi({
            description,
            api,
            url,
            responseBody,
            requestBody,
            responseStatus,
            method,
          })
        }
      })
    }
  })
})
