import Service, { type IService } from '.'
import { type User } from '../database/entity/User'
import { UserRepository } from '../repositories/user.repository'

interface IUserService extends IService<User> {}

class UserService
  extends Service<User, typeof UserRepository>
  implements IUserService
{
  constructor() {
    super(UserRepository)
  }
}

export default UserService
