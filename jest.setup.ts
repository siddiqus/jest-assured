require('dotenv').config()

import { closeAllConnections } from './src/core/providers/db'

jest.setTimeout(100000)

afterAll(async () => {
  await closeAllConnections()
})
