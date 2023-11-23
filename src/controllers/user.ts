import { type Request } from 'express'
import { type ResponseController } from '../types/ResponseController'
import { Controller } from '../decorators/Controller'
import UserService from '../services/user_service'
import { type UserResRegister } from '../database/models/user/dto/UserResRegister'

interface IUserController {
  getByEmail: (req: Request) => Promise<ResponseController<UserResRegister>>
}

@Controller()
class UserController implements IUserController {
  public async getByEmail(
    req: Request
  ): Promise<ResponseController<UserResRegister>> {
    const email = req.params.email
    const userService = new UserService()
    const user = await userService.getByEmail(email)
    return [user, `User by email ${email}`]
  }
}

const userController = new UserController()
export default userController
