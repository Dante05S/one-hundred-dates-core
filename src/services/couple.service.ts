import type { ResponseConnect } from '../database/entity/Couple/dto/response-connect'
import Service, { type IService } from '.'
import { type Couple } from '../database/entity/Couple'
import { CoupleRepository } from '../repositories/couple.repository'
import type { RequestConnect } from '../database/entity/Couple/dto/request-connect'
import { UserRepository } from '../repositories/user.repository'
import { NotFoundError } from '../helpers/exceptions-errors'
import { TypeCouple } from '../enums/type-couple'
import { notify } from '../libs/pusher/notify'

interface ICoupleService extends IService<Couple> {
  createCouple: (
    userId: string,
    data: RequestConnect
  ) => Promise<ResponseConnect>
}

class CoupleService
  extends Service<Couple, typeof CoupleRepository>
  implements ICoupleService
{
  constructor() {
    super(CoupleRepository)
  }

  public async createCouple(
    userId: string,
    data: RequestConnect
  ): Promise<ResponseConnect> {
    const { coupleCode } = data

    const userB = await UserRepository.findOne({
      where: { temp_couple_code: coupleCode },
      select: ['id']
    })

    if (userB === null)
      throw new NotFoundError(
        'No se encontro ningun usuario por ese codigo de pareja'
      )

    await this.create({
      id: coupleCode,
      user_a_id: userId,
      user_b_id: userB.id
    })

    const userAPromise = UserRepository.update(
      { id: userId },
      { temp_couple_code: null, type_couple: TypeCouple.A }
    )

    const userBPromise = UserRepository.update(
      { id: userB.id },
      { temp_couple_code: null, type_couple: TypeCouple.B }
    )

    await Promise.all([userAPromise, userBPromise])

    const payload = {
      id: coupleCode,
      init_date: null,
      user_a_id: userId,
      user_b_id: userB.id
    }

    const pusherChannel = `USER_${userB.id}`
    const pusherMessage = {
      couple: payload
    }
    void notify(pusherChannel, 'connect-couple', pusherMessage)

    return payload
  }
}

export default CoupleService
