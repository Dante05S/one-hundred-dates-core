import 'dotenv/config'
import { type DataSourceOptions } from 'typeorm'

interface ConfigDataBase {
  production: DataSourceOptions
  local: DataSourceOptions
}

export type ConfigEnv = keyof ConfigDataBase

const config: ConfigDataBase = {
  production: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: ['database/entity/**/*.js'],
    migrations: ['database/migrations/*{.ts,.js}'],
    subscribers: []
  },
  local: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: ['src/database/entity/**/*{.ts,.js}'],
    migrations: ['src/database/migrations/*{.ts,.js}'],
    subscribers: []
  }
}

export default config
