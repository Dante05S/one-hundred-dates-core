import Service from '.'
import type User from '../database/models/user'
import { type IUser, type UserCreation } from '../database/models/user'
import UserRepository from '../repositories/user_repository'
import { type UserQuery } from '../types/user_query'

interface IUserService {
  getByEmail: (email: string) => Promise<UserQuery>
}

class UserService
  extends Service<IUser, UserCreation, User, UserRepository>
  implements IUserService
{
  constructor() {
    super(new UserRepository())
  }

  public async getByEmail(email: string): Promise<UserQuery> {
    const user = await this.getOne({ email }, 'El usario no existe ')
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}

export default UserService
