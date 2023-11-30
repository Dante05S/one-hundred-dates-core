// Database connection
import sequelize from './connection'
import models from './models'

sequelize.addModels(models)

// Sync database

const syncDB = async (): Promise<void> => {
  try {
    await sequelize.sync()
  } catch (error) {
    console.error('Error synchronizing models:', error)
  }
}

void syncDB()

export default sequelize
