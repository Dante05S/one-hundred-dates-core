import type { User } from '../database/entity/User'
import Service, { type IService } from '.'
import { UserRepository } from '../repositories/user.repository'
import type { UserRefresh } from '../database/entity/User/dto/user-refresh'
import { createRefreshToken, createToken } from '../helpers/tokenize'
import type {
  UserRegister,
  UserResRegister
} from '../database/entity/User/dto/user-register'
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  ServerError
} from '../helpers/exceptions-errors'
import bcrypt from 'bcrypt'
import CodeTokenService from './code-token.service'
import { getContentHtml } from '../utils/get-content-html'
import { sendEmail } from '../utils/nodemailer-service'
import type { UserLogin } from '../database/entity/User/dto/user-login'
import type { TokenUser } from '../database/entity/User/dto/user-token'
import type { RequestCode } from '../database/entity/User/dto/request-code'

interface IAuthService extends IService<User> {
  refresh: (id: string) => Promise<UserRefresh>
  register: (data: UserRegister) => Promise<UserResRegister>
  validateCode: (data: UserLogin) => Promise<TokenUser>
  login: (data: RequestCode) => Promise<UserResRegister>
  resendCode: (email: string) => Promise<null>
}

class AuthService
  extends Service<User, typeof UserRepository>
  implements IAuthService
{
  constructor() {
    super(UserRepository)
  }

  private async existUserByEmail(email: string): Promise<void> {
    const user = await this.repository.findOne({
      where: { email: email.toLowerCase() },
      select: ['id']
    })

    if (user !== null) {
      throw new BadRequestError('Ya hay un usuario registrado con este email')
    }
  }

  private async existUserByName(name: string): Promise<void> {
    const user = await this.repository.findOne({
      where: { name: name.toLowerCase() },
      select: ['id']
    })

    if (user !== null) {
      throw new BadRequestError(
        'Ya hay un usuario registrado con este nombre de usuario'
      )
    }
  }

  private async generateVerifyCode(
    email: string,
    name: string,
    idUser: string
  ): Promise<void> {
    const codeTokenService = new CodeTokenService()
    const codeToken = await codeTokenService.generate(idUser)

    const contentHtml = getContentHtml(name, codeToken)
    const [success, message] = await sendEmail(
      `'ABS Mailer' <${process.env.NODEMAILER_EMAIL ?? ''}>`,
      email,
      'Codigo de verificación de GameQuestBooking',
      contentHtml
    )
    if (!success) {
      throw new ServerError(message)
    }
  }

  public async register(data: UserRegister): Promise<UserResRegister> {
    const { email, name, password } = data

    // Validate if user exist by name and email
    await Promise.all([
      this.existUserByEmail(email),
      this.existUserByName(name)
    ])

    const [user] = await this.create({
      name: name.toLowerCase(),
      password: bcrypt.hashSync(password, 12),
      email: email.toLowerCase()
    })

    await this.generateVerifyCode(email, name, user.id as string)
    return {
      name,
      email
    }
  }

  public async refresh(id: string): Promise<UserRefresh> {
    const token = createToken(id)
    const refreshToken = createRefreshToken(id)

    await this.repository.update({ id }, { refresh_token: refreshToken })

    return {
      token,
      refresh_token: refreshToken
    }
  }

  public async validateCode(data: UserLogin): Promise<TokenUser> {
    const { email, codeToken } = data

    const user = await this.repository.getUserByEmail(email)

    if (user === null) {
      throw new NotFoundError('No hay ningun usuario registrado con este email')
    }

    const codeTokenService = new CodeTokenService()
    await codeTokenService.verify(user.id, codeToken)

    const token = createToken(user.id)
    const refreshToken = createRefreshToken(user.id)

    return {
      user: {
        name: user.name,
        email: user.email,
        type_couple: user.type_couple
      },
      token,
      refresh_token: refreshToken
    }
  }

  public async login(data: RequestCode): Promise<UserResRegister> {
    const { email, password } = data

    const [userEmail, userName] = await Promise.all([
      this.repository.getUserByEmail(email),
      this.repository.getUserByName(email)
    ])

    if (userEmail === null && userName === null) {
      throw new NotFoundError(
        'No hay ningun usuario registrado con este email o nombre de usuario'
      )
    }

    const user = userEmail ?? userName

    if (!bcrypt.compareSync(password, user?.password ?? '')) {
      throw new NotAuthorizedError('La contraseña es incorrecta')
    }

    await this.generateVerifyCode(
      user?.email ?? '',
      user?.name ?? '',
      user?.id ?? ''
    )
    return {
      name: user?.name ?? '',
      email: user?.email ?? ''
    }
  }

  public async resendCode(email: string): Promise<null> {
    const user = await this.repository.getUserByEmail(email)
    if (user === null)
      throw new NotFoundError('No hay ningun usuario registrado con este email')
    await this.generateVerifyCode(user.email, user.name, user.id)
    return null
  }
}

export default AuthService
