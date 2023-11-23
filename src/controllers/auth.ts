import { type Request } from 'express'
import { type ResponseController } from '../types/ResponseController'
import { Controller } from '../decorators/Controller'
import AuthService from '../services/auth_service'
import { type IUser } from '../database/models/user'
import { type ResponseObjectData } from '../helpers/request'
import { type UserCreate } from '../database/models/user/dto/UserCreate'
import { type UserResRegister } from '../database/models/user/dto/UserResRegister'
import { type UserResLogin } from '../database/models/user/dto/UserResLogin'
import { type UserLogin } from '../database/models/user/dto/UserLogin'
import { type RequestCode } from '../database/models/user/dto/RequestCode'

interface IAuthController {
  register: (
    req: Request<ResponseObjectData, any, UserCreate>
  ) => Promise<ResponseController<UserResRegister>>
  validateCode: (req: Request<ResponseObjectData, any, UserLogin>) => Promise<
    ResponseController<{
      user: UserResRegister
      token: string
    }>
  >
  login: (
    req: Request<ResponseObjectData, any, RequestCode>
  ) => Promise<ResponseController<UserResLogin>>
  resendCode: (
    req: Request<ResponseObjectData, any, Pick<IUser, 'email'>>
  ) => Promise<ResponseController>
}

@Controller()
class AuthController implements IAuthController {
  public async register(
    req: Request<ResponseObjectData, any, UserCreate>
  ): Promise<ResponseController<UserResRegister>> {
    const data = req.body
    const authService = new AuthService()
    const user = await authService.register(data)
    return [user, 'User register successfully']
  }

  public async validateCode(
    req: Request<ResponseObjectData, any, UserLogin>
  ): Promise<
    ResponseController<{
      user: UserResRegister
      token: string
    }>
  > {
    const data = req.body
    const authService = new AuthService()
    const user = await authService.validateCode(data)
    return [user, 'Login user Successfully']
  }

  public async login(
    req: Request<ResponseObjectData, any, RequestCode>
  ): Promise<ResponseController<UserResLogin>> {
    const data = req.body
    const authService = new AuthService()
    const request = await authService.login(data)
    return [request, 'Login user Successfully']
  }

  public async resendCode(
    req: Request<ResponseObjectData, any, Pick<IUser, 'email'>>
  ): Promise<ResponseController> {
    const data = req.body
    const authService = new AuthService()
    const request = await authService.resendCode(data.email)
    return [request, 'Resend verification code Successfully']
  }
}

const authController = new AuthController()
export default authController
