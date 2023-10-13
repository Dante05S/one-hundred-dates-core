import { type Request } from 'express'
import { type ResponseController } from '../types/ResponseController'
import { Controller } from '../decorators/Controller'
import AuthService from '../services/auth_service'
import { type IUser, type UserCreation } from '../database/models/user'
import { type UserQuery } from '../types/user_query'
import { type Login } from '../interfaces/login'
import { type ResponseObjectData } from '../helpers/request'
import { type RequestCode } from '../types/request_code'

interface IAuthController {
  register: (
    req: Request<ResponseObjectData, any, UserCreation>
  ) => Promise<ResponseController<UserQuery>>
  login: (req: Request<ResponseObjectData, any, Login>) => Promise<
    ResponseController<{
      user: UserQuery
      token: string
    }>
  >
  requestCode: (
    req: Request<ResponseObjectData, any, RequestCode>
  ) => Promise<ResponseController>
  resendCode: (
    req: Request<ResponseObjectData, any, Pick<IUser, 'email'>>
  ) => Promise<ResponseController>
}

@Controller()
class AuthController implements IAuthController {
  public async register(
    req: Request<ResponseObjectData, any, UserCreation>
  ): Promise<ResponseController<UserQuery>> {
    const data = req.body
    const authService = new AuthService()
    const user = await authService.register(data)
    return [user, 'User register successfully']
  }

  public async login(req: Request<ResponseObjectData, any, Login>): Promise<
    ResponseController<{
      user: UserQuery
      token: string
    }>
  > {
    const data = req.body
    const authService = new AuthService()
    const user = await authService.login(data)
    return [user, 'Login user Successfully']
  }

  public async requestCode(
    req: Request<ResponseObjectData, any, RequestCode>
  ): Promise<ResponseController> {
    const data = req.body
    const authService = new AuthService()
    const request = await authService.requestCode(data)
    return [request, 'Request verification code Successfully']
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
