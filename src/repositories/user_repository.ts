import Repository from '.'
import User, { type IUser, type UserCreation } from '../database/models/user'
import { NotFoundError } from '../helpers/exceptions_errors'
import { type UserQueryPassword } from '../types/user_query'

interface IUserRepository {
  getUserByEmail: (email: string) => Promise<UserQueryPassword>
}

export default class UserRepository
  extends Repository<IUser, UserCreation, User>
  implements IUserRepository
{
  constructor() {
    super(User)
  }

  public async getUserByEmail(email: string): Promise<UserQueryPassword> {
    const user = await this.getOne({
      where: {
        email
      },
      attributes: {
        exclude: ['created_at', 'updated_at', 'deleted_at']
      }
    })

    if (user === null) {
      throw new NotFoundError(
        `No hay ningun usuario registrado con este email (${email})`
      )
    }
    return user.dataValues
  }
}
