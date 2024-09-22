import { type ResponseController } from '../types/response-controller'
import { Controller } from '../decorators/Controller'
import AuthService from '../services/auth.service'
import type { CustomRequest } from '../types/custom-request'
import type { UserRefresh } from '../database/entity/User/dto/user-refresh'

interface IAuthController {
  refresh: (req: CustomRequest) => Promise<ResponseController<UserRefresh>>
}

@Controller()
class AuthController implements IAuthController {
  public async refresh(
    req: CustomRequest
  ): Promise<ResponseController<UserRefresh>> {
    const id = req.id
    const authService = new AuthService()
    const request = await authService.refresh(id)
    return [request, 'Refresh session Successfully']
  }
}

const authController = new AuthController()
export default authController
