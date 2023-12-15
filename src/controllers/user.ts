import { type Request } from 'express'
import { type ResponseController } from '../types/ResponseController'
import { Controller } from '../decorators/Controller'
import UserService from '../services/user_service'
import { type UserResRegister } from '../database/models/user/dto/UserResRegister'
import { type CustomRequest } from '../interfaces/custom_request'
import { type UserCoupleCode } from '../database/models/user/dto/UserCoupleCode'

interface IUserController {
  getByEmail: (req: Request) => Promise<ResponseController<UserResRegister>>
  generateCoupleCode: (
    req: CustomRequest
  ) => Promise<ResponseController<UserCoupleCode>>
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

  public async generateCoupleCode(
    req: CustomRequest
  ): Promise<ResponseController<UserCoupleCode>> {
    const userId = req.user_id
    const userService = new UserService()

    // Validate if have couple
    await userService.haveCouple(userId)

    // Generate couple code
    const coupleCode = await userService.generateCoupleCode(userId)
    return [coupleCode, 'Couple Code generated successfully']
  }
}

const userController = new UserController()
export default userController
