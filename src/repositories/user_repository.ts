import { Op, type WhereOptions } from 'sequelize'
import Repository from '.'
import User, { type IUser } from '../database/models/user'
import { NotFoundError } from '../helpers/exceptions_errors'
import { type UserPassword } from '../database/models/user/dto/UserPassword'

interface IUserRepository {
  getUserByEmail: (email: string) => Promise<UserPassword>
}

export default class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  constructor() {
    super(User)
  }

  public async existUserByEmail(email: string): Promise<void> {
    const user = await this.getOne({
      where: {
        email: email.toLowerCase()
      },
      attributes: {
        exclude: ['created_at', 'updated_at', 'deleted_at']
      }
    })

    if (user !== null) {
      throw new NotFoundError('Ya hay un usuario registrado con este email')
    }
  }

  public async existUserByName(name: string): Promise<void> {
    const user = await this.getOne({
      where: {
        name: {
          [Op.iLike]: `%${name}`
        }
      },
      attributes: {
        exclude: ['created_at', 'updated_at', 'deleted_at']
      }
    })

    if (user !== null) {
      throw new NotFoundError('Ya hay un usuario registrado con este nombre')
    }
  }

  public async getUserByEmail(
    email: string,
    withName = false
  ): Promise<UserPassword> {
    let where: WhereOptions<IUser> = {
      email: email.toLowerCase()
    }
    if (withName) {
      where = {
        [Op.or]: [
          { email: email.toLowerCase() },
          { name: { [Op.iLike]: `${email}` } }
        ]
      }
    }

    const user = await this.getOne({
      where,
      attributes: {
        exclude: ['created_at', 'updated_at', 'deleted_at']
      }
    })

    if (user === null) {
      throw new NotFoundError(
        'No hay ningun usuario registrado con ese nombre o email'
      )
    }
    return user
  }
}
