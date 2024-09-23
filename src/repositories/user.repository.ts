import AppDataSource from '../database/connection'
import { User } from '../database/entity/User'

export const UserRepository = AppDataSource.getRepository(User).extend({
  async getUserByEmail(email: string) {
    return await this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.password',
        'user.email',
        'user.type_couple'
      ])
      .where('user.email = :email', {
        email: email.toLowerCase()
      })
      .getOne()
  },
  async getUserByName(name: string) {
    return await this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.password',
        'user.email',
        'user.type_couple'
      ])
      .where('user.name = :name', {
        name: name.toLowerCase()
      })
      .getOne()
  }
})
