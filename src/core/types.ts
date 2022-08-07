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

export interface ApiConfig {
  baseUrl: string
  headers: Record<string, any>
}

export type ApiProviders = typeof config.providers.api[number]

export type DbProviders = typeof config.providers.db[number]

export type DbConfigsMap = Record<DbProviders, DbConfig>

export type ApiConfigsMap = Record<ApiProviders, ApiConfig>

export interface DbClient {
  selectAll: (sqlQuery: string, options?: QueryOptions) => Promise<any[]>
  selectOne: (sqlQuery: string, options?: QueryOptions) => Promise<any>
  deleteQuery: (sqlQuery: string, options?: QueryOptions) => Promise<void>
  closeConnection: () => Promise<void>
}
