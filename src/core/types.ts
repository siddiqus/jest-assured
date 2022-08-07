import { QueryOptions } from 'sequelize'
import config from '../../.jest-assured.config'

export interface DbConfig {
  dialect: 'postgres' | 'mysql'
  host: string
  port: string
  database: string
  username: string
  password: string
}

export type DbConfigsMap = Record<typeof config.providers.db[number], DbConfig>

export interface ApiConfig {
  baseUrl: string
  headers: Record<string, any>
}

export type ApiConfigsMap = Record<
  typeof config.providers.api[number],
  ApiConfig
>

export interface DbClient {
  selectAll: (sqlQuery: string, options?: QueryOptions) => Promise<any[]>
  selectOne: (sqlQuery: string, options?: QueryOptions) => Promise<any>
  deleteQuery: (sqlQuery: string, options?: QueryOptions) => Promise<void>
  closeConnection: () => Promise<void>
}
