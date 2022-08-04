import fs from 'fs'
import path from 'path'

function readApiUsageFile() {
  const usageFilePath = path.join(__dirname, 'reports', 'api-usage.txt')

  if (!fs.existsSync(usageFilePath)) {
    return
  }
  const fileContents = fs
    .readFileSync(usageFilePath)
    .toString()
    .split('\n')
    .filter(Boolean)

  const usageMap = fileContents.reduce((usgMap, apiCall) => {
    const [service, method, url] = apiCall.split(' ')
    const apiurl = `${method} ${url}`

    const newMap: any = { ...usgMap }
    newMap[service] = newMap[service] || {}
    newMap[service][apiurl] = newMap[service][apiurl]
      ? newMap[service][apiurl] + 1
      : 1
    return newMap
  }, {})

  fs.writeFileSync(
    path.join(__dirname, 'reports', 'api-usage.json'),
    JSON.stringify(usageMap, null, 2)
  )
  fs.unlinkSync(usageFilePath)
}

const teardown = async () => {
  try {
    readApiUsageFile()
  } catch (error) {
    console.error(error)
  }
}

module.exports = () => {
  teardown()
}
