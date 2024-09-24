import { type ResponseController } from '../types/response-controller'
import { Controller } from '../decorators/Controller'
import CoupleService from '../services/couple.service'
import type { ResponseConnect } from '../database/entity/Couple/dto/response-connect'
import type { RequestConnect } from '../database/entity/Couple/dto/request-connect'
import type { CustomRequest } from '../types/custom-request'

interface ICoupleController {
  connect: (
    req: CustomRequest<RequestConnect>
  ) => Promise<ResponseController<ResponseConnect>>
}

@Controller()
class CoupleController implements ICoupleController {
  public async connect(
    req: CustomRequest<RequestConnect>
  ): Promise<ResponseController<ResponseConnect>> {
    const data = req.body
    const userId = req.id

    const service = new CoupleService()
    const couple = await service.createCouple(userId, data)
    return [couple, 'Get data couple successfully']
  }
}

const coupleController = new CoupleController()
export default coupleController
