import Service from '.'
import type Couple from '../database/models/couple'
import { type CoupleCreate } from '../database/models/couple/dto/CoupleCreate'
import CoupleRepository from '../repositories/couple_repository'
import UserService from './user_service'

interface ICoupleService {
  createCouple: (
    coupleCode: string,
    userAId: string,
    userBId: string
  ) => Promise<CoupleCreate>
}

class CoupleService
  extends Service<Couple, CoupleRepository>
  implements ICoupleService
{
  constructor() {
    super(new CoupleRepository())
  }

  public async createCouple(
    coupleCode: string,
    userAId: string,
    userBId: string
  ): Promise<CoupleCreate> {
    const couple = await this.create({
      id: coupleCode,
      user_a_id: userAId,
      user_b_id: userBId
    })

    const userService = new UserService()
    const updateUserAPromise = userService.setTypeCouple(userAId, 'a')
    const updateUserBPromise = userService.setTypeCouple(userBId, 'b')

    await Promise.all([updateUserAPromise, updateUserBPromise])

    return {
      id: couple.id,
      user_a_id: couple.user_a_id,
      user_b_id: couple.user_b_id
    }
  }
}

export default CoupleService
