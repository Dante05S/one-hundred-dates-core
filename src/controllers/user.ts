import { type ResponseController } from '../types/response-controller'
import { Controller } from '../decorators/Controller'
import UserService from '../services/user.service'
import { type UserCouple } from '../database/entity/User/dto/user-couple'
import { type CustomRequest } from '../types/custom-request'

interface IUserController {
  get: (req: CustomRequest) => Promise<ResponseController<UserCouple>>
}

@Controller()
class UserController implements IUserController {
  public async get(
    req: CustomRequest
  ): Promise<ResponseController<UserCouple>> {
    const userId = req.id
    const service = new UserService()

    const data = await service.get(userId, 'user not found', [
      'name',
      'email',
      'type_couple'
    ])
    return [data, 'Get user successfully']
  }
}

const userController = new UserController()
export default userController
