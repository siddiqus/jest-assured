import { QueryOptions } from 'sequelize'
import { apiProviders, dbProviders } from '../../provider.declaration'

export interface DbConfig {
  dialect: 'postgres' | 'mysql'
  host: string
  port: string
  database: string
  username: string
  password: string
}

export type DbConfigsMap = Record<typeof dbProviders[number], DbConfig>

export interface ApiConfig {
  baseUrl: string
  headers: Record<string, any>
}

export type ApiConfigsMap = Record<typeof apiProviders[number], ApiConfig>

export interface DbClient {
  selectAll: (sqlQuery: string, options?: QueryOptions) => Promise<any[]>
  selectOne: (sqlQuery: string, options?: QueryOptions) => Promise<any>
  deleteQuery: (sqlQuery: string, options?: QueryOptions) => Promise<void>
  closeConnection: () => Promise<void>
}
