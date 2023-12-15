import { type ResponseController } from '../types/ResponseController'
import { Controller } from '../decorators/Controller'
import CoupleService from '../services/couple_service'
import { type CustomRequest } from '../interfaces/custom_request'
import { type ReqCoupleCreate } from '../database/models/couple/dto/ReqCoupleCreate'
import UserService from '../services/user_service'
import { type CoupleCreate } from '../database/models/couple/dto/CoupleCreate'

interface ICoupleController {
  create: (
    req: CustomRequest<ReqCoupleCreate>
  ) => Promise<ResponseController<CoupleCreate>>
}

@Controller()
class CoupleController implements ICoupleController {
  public async create(
    req: CustomRequest<ReqCoupleCreate>
  ): Promise<ResponseController<CoupleCreate>> {
    const coupleCode = req.body.couple_code
    const userId = req.user_id

    // Get the other couple
    const userService = new UserService()
    const user = await userService.getByCoupleCode(coupleCode, userId)

    // Create couple
    const service = new CoupleService()
    const couple = await service.createCouple(coupleCode, userId, user.id)
    return [couple, 'Get data couple successfully']
  }
}

const coupleController = new CoupleController()
export default coupleController
