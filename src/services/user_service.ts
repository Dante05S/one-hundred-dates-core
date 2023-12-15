import { Op } from 'sequelize'
import Service from '.'
import type User from '../database/models/user'
import { type UserCoupleCode } from '../database/models/user/dto/UserCoupleCode'
import { type UserResRegister } from '../database/models/user/dto/UserResRegister'
import { BadRequestError, NotFoundError } from '../helpers/exceptions_errors'
import UserRepository from '../repositories/user_repository'
import generateRandomString from '../utils/random_string'
import { type IUser } from '../database/models/user'
import CoupleRepository from '../repositories/couple_repository'

interface IUserService {
  getByEmail: (email: string) => Promise<UserResRegister>
  generateCoupleCode: (userId: string) => Promise<UserCoupleCode>
  getByCoupleCode: (coupleCode: string, id: string) => Promise<IUser>
}

class UserService
  extends Service<User, UserRepository>
  implements IUserService
{
  constructor() {
    super(new UserRepository())
  }

  private async generateCode(): Promise<string> {
    const coupleCode = generateRandomString(10)
    const userPromise = this.repository.getOne({
      where: { temp_couple_code: coupleCode }
    })

    const coupleRepository = new CoupleRepository()
    const couplePromise = coupleRepository.getById(coupleCode)

    const [user, couple] = await Promise.all([userPromise, couplePromise])

    if (user !== null || couple !== null) {
      return await this.generateCode()
    }
    return coupleCode
  }

  public async getByEmail(email: string): Promise<UserResRegister> {
    const user = await this.getOne({ email }, 'El usario no existe ')
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }

  public async generateCoupleCode(userId: string): Promise<UserCoupleCode> {
    // Verify if couple_code exist
    let user = await this.get(userId, 'El usuario no existe')
    if (user.temp_couple_code !== null)
      return { temp_couple_code: user.temp_couple_code }

    // Generate new couple_code
    const coupleCode = await this.generateCode()
    user = await this.update(
      userId,
      { temp_couple_code: coupleCode },
      'El usario no existe'
    )
    return { temp_couple_code: user.temp_couple_code }
  }

  public async getByCoupleCode(coupleCode: string, id: string): Promise<IUser> {
    const user = await this.repository.getOne({
      where: {
        id: {
          [Op.ne]: id
        },
        temp_couple_code: coupleCode
      }
    })
    if (user === null)
      throw new NotFoundError(
        `No existe algun usuario con este codigo de pareja ${coupleCode}`
      )
    return user
  }

  public async setTypeCouple(id: string, type: 'a' | 'b'): Promise<IUser> {
    const user = await this.update(
      id,
      {
        temp_couple_code: null,
        type_couple: type
      },
      'El usuario no existe'
    )
    return user
  }

  public async haveCouple(id: string): Promise<void> {
    const coupleRepository = new CoupleRepository()
    const couple = await coupleRepository.getOne({
      where: {
        [Op.or]: [{ user_a_id: id }, { user_b_id: id }]
      }
    })

    if (couple !== null) {
      throw new BadRequestError('El usuario ya tiene pareja')
    }
  }
}

export default UserService
