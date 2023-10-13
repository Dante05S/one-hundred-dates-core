import { Sequelize } from 'sequelize-typescript'
import { type Dialect } from 'sequelize/types/sequelize'

const sequelize = new Sequelize(
  process.env.DB_NAME ?? '',
  process.env.DB_USER ?? '',
  process.env.DB_PASS,
  {
    host:
      process.env.DB_CONNECTION_NAME !== undefined
        ? `/cloudsql/${process.env.DB_CONNECTION_NAME}`
        : process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: process.env.DB_DRIVER as Dialect,
    protocol: process.env.DB_DRIVER ?? '',
    dialectOptions:
      process.env.DB_CONNECTION_NAME !== undefined
        ? {
            // ssl: true
            socketPath: `/cloudsql/${process.env.DB_CONNECTION_NAME}`
          }
        : {
            ssl: false
          },
    logging: false,
    define: {
      underscored: true
    },
    pool: {
      min: 0, // numero minimo de conexiones permitidas
      max: 10, // numero de conexiones maximas permitidas
      idle: 15000, // 15s maximos de inactvidad antes de desconectarse
      acquire: 60000 // 60s maximos de intento de conexion antes de lanzar error
    }
  }
)

export default sequelize
