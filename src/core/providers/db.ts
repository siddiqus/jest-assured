import { QueryOptions, QueryTypes, Sequelize } from 'sequelize'
import { dbConfigs } from './provider-configs'
import { DbClient, DbConfig } from '../types'

function _getDbMethods(dbConfig: DbConfig) {
  let sequelize: Sequelize

  async function getDb() {
    if (sequelize) {
      return sequelize
    }

    sequelize = new Sequelize({
      host: dbConfig.host,
      port: Number(dbConfig.port),
      dialect: dbConfig.dialect,
      logging: false,
      database: dbConfig.database,
      username: dbConfig.username,
      password: dbConfig.password,
      dialectModule:
        dbConfig.dialect === 'mysql' ? require('mysql2') : undefined,
    })
    await sequelize.authenticate()
    return sequelize
  }

  const closeConnection = async () => {
    if (sequelize) {
      await sequelize.close()
    }
  }

  const dbSelect = async (sqlQuery: string, queryOptions?: QueryOptions) => {
    const opts = queryOptions || {}
    const db = await getDb()
    return await db.query(sqlQuery, {
      ...opts,
      type: QueryTypes.SELECT,
    })
  }

  const dbSelectOne = async (sqlQuery: string, queryOptions?: QueryOptions) => {
    const result = await dbSelect(sqlQuery, queryOptions)
    if (result.length === 0) {
      return null
    }
    return result[0]
  }

  const deleteQuery = async (sqlQuery: string, queryOptions?: QueryOptions) => {
    const opts = queryOptions || {}
    const db = await getDb()
    await db.query(sqlQuery, {
      ...opts,
      type: QueryTypes.DELETE,
    })
  }

  return {
    selectAll: dbSelect,
    selectOne: dbSelectOne,
    deleteQuery,
    closeConnection,
  }
}

function _getDbObject() {
  const appNames = Object.keys(dbConfigs)
  if (appNames.length === 0) {
    return {}
  }

  const obj = appNames.reduce((dbObj, dbKey) => {
    const newObj = {
      [dbKey]: _getDbMethods((dbConfigs as any)[dbKey]),
    }
    return {
      ...dbObj,
      ...newObj,
    }
  }, {})

  return obj as any
}

export const db: Record<keyof typeof dbConfigs, DbClient> = _getDbObject()

export async function closeAllConnections() {
  for (const app of Object.keys(dbConfigs)) {
    await (db as any)[app].closeConnection()
  }
}
