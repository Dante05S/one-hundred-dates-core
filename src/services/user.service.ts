/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { CodeCouple } from '../database/entity/User/dto/code-couple'
import Service, { type IService } from '.'
import { type User } from '../database/entity/User'
import { UserRepository } from '../repositories/user.repository'
import { generateRandomString } from '../utils/generate-string'
import { CoupleRepository } from '../repositories/couple.repository'
import type { UserCouple } from '../database/entity/User/dto/user-couple'
import { NotFoundError } from '../helpers/exceptions-errors'

interface IUserService extends IService<User> {
  getCoupleCode: (id: string) => Promise<CodeCouple>
  getUserCouple: (id: string) => Promise<UserCouple>
}

class UserService
  extends Service<User, typeof UserRepository>
  implements IUserService
{
  constructor() {
    super(UserRepository)
  }

  private async generateCoupleCode(): Promise<string> {
    const code = generateRandomString(10)
    const existCoupleCodePromise = this.repository.findOne({
      where: { temp_couple_code: code },
      select: ['id']
    })
    const existCouplePromise = CoupleRepository.findOne({
      where: { id: code },
      select: ['id']
    })

    const [existCoupleCode, existCouple] = await Promise.all([
      existCoupleCodePromise,
      existCouplePromise
    ])

    if (existCoupleCode || existCouple) return await this.generateCoupleCode()
    return code
  }

  public async getCoupleCode(id: string): Promise<CodeCouple> {
    const user = await this.get(id, 'El usario no existe', [
      'id',
      'temp_couple_code'
    ])
    if (user.temp_couple_code) {
      return {
        temp_couple_code: user.temp_couple_code
      }
    }

    const coupleCode = await this.generateCoupleCode()
    await this.repository.update({ id }, { temp_couple_code: coupleCode })

    return {
      temp_couple_code: coupleCode
    }
  }

  public async getUserCouple(id: string): Promise<UserCouple> {
    const user = await this.repository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'type_couple']
    })

    if (user === null) throw new NotFoundError('El usuario no existe')

    let couple = null
    if (user.type_couple) {
      couple = await CoupleRepository.findOne({
        where: { [`user_${user.type_couple}_id`]: user.id },
        select: ['id', 'init_date', 'user_a_id', 'user_b_id']
      })
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      type_couple: user.type_couple,
      couple
    }
  }
}

export default UserService
