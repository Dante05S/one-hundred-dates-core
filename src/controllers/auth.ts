import { type Request } from 'express'
import { type ResponseController } from '../types/response-controller'
import { Controller } from '../decorators/Controller'
import AuthService from '../services/auth.service'
import type { CustomRequest } from '../types/custom-request'
import type { UserRefresh } from '../database/entity/User/dto/user-refresh'
import type { ResponseObjectData } from 'src/helpers/request'
import type {
  UserRegister,
  UserResRegister
} from '../database/entity/User/dto/user-register'
import type { TokenUser } from '../database/entity/User/dto/user-token'
import type { UserLogin } from '../database/entity/User/dto/user-login'
import type { RequestCode } from '../database/entity/User/dto/request-code'

interface IAuthController {
  register: (
    req: Request<ResponseObjectData, any, UserRegister>
  ) => Promise<ResponseController<UserResRegister>>
  refresh: (req: CustomRequest) => Promise<ResponseController<UserRefresh>>
  validateCode: (
    req: Request<ResponseObjectData, any, UserLogin>
  ) => Promise<ResponseController<TokenUser>>
  login: (
    req: Request<ResponseObjectData, any, RequestCode>
  ) => Promise<ResponseController<UserResRegister>>
}

@Controller()
class AuthController implements IAuthController {
  public async register(
    req: Request<ResponseObjectData, any, UserRegister>
  ): Promise<ResponseController<UserResRegister>> {
    const data = req.body
    const authService = new AuthService()
    const user = await authService.register(data)
    return [user, 'User register successfully']
  }

  public async refresh(
    req: CustomRequest
  ): Promise<ResponseController<UserRefresh>> {
    const id = req.id
    const authService = new AuthService()
    const request = await authService.refresh(id)
    return [request, 'Refresh session Successfully']
  }

  public async validateCode(
    req: Request<ResponseObjectData, any, UserLogin>
  ): Promise<ResponseController<TokenUser>> {
    const data = req.body
    const authService = new AuthService()
    const user = await authService.validateCode(data)
    return [user, 'Login user Successfully']
  }

  public async login(
    req: Request<ResponseObjectData, any, RequestCode>
  ): Promise<ResponseController<UserResRegister>> {
    const data = req.body
    const authService = new AuthService()
    const request = await authService.login(data)
    return [request, 'Login user Successfully']
  }
}

const authController = new AuthController()
export default authController
