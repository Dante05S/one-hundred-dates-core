import Service from '.'
import type User from '../database/models/user'
import { type UserResRegister } from '../database/models/user/dto/UserResRegister'
import UserRepository from '../repositories/user_repository'

interface IUserService {
  getByEmail: (email: string) => Promise<UserResRegister>
}

class UserService
  extends Service<User, UserRepository>
  implements IUserService
{
  constructor() {
    super(new UserRepository())
  }

  public async getByEmail(email: string): Promise<UserResRegister> {
    const user = await this.getOne({ email }, 'El usario no existe ')
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}

export default UserService
