import Service from '.'
import type User from '../database/models/user'
import { type UserCoupleCode } from '../database/models/user/dto/UserCoupleCode'
import { type UserResRegister } from '../database/models/user/dto/UserResRegister'
import UserRepository from '../repositories/user_repository'
import generateRandomString from '../utils/random_string'

interface IUserService {
  getByEmail: (email: string) => Promise<UserResRegister>
  generateCoupleCode: (userId: string) => Promise<UserCoupleCode>
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
    const user = await this.repository.getOne({
      where: { temp_couple_code: coupleCode }
    })
    if (user !== null) {
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
}

export default UserService
