import AppDataSource from '../database/connection'
import { User } from '../database/entity/User'

export const UserRepository = AppDataSource.getRepository(User).extend({})
