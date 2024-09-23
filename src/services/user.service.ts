import type { CodeCouple } from '../database/entity/User/dto/code-couple'
import Service, { type IService } from '.'
import { type User } from '../database/entity/User'
import { UserRepository } from '../repositories/user.repository'
import { generateRandomString } from '../utils/generate-string'

interface IUserService extends IService<User> {}

class UserService
  extends Service<User, typeof UserRepository>
  implements IUserService
{
  constructor() {
    super(UserRepository)
  }

  private async generateCoupleCode(): Promise<string> {
    const code = generateRandomString(10)
    const existCoupleCode = await this.repository.findOne({
      where: { temp_couple_code: code },
      select: ['id']
    })
    if (existCoupleCode) return await this.generateCoupleCode()
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
}

export default UserService
