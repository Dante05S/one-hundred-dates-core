import Service from '.'
import type User from '../database/models/user'
import { type RequestCode } from '../database/models/user/dto/RequestCode'
import { type UserCreate } from '../database/models/user/dto/UserCreate'
import { type UserLogin } from '../database/models/user/dto/UserLogin'
import { type UserResLogin } from '../database/models/user/dto/UserResLogin'
import { type UserResRegister } from '../database/models/user/dto/UserResRegister'
import {
  BadRequestError,
  NotAuthorizedError,
  PermissionDeniedError,
  ServerError
} from '../helpers/exceptions_errors'
import { createToken } from '../helpers/tokenize'
import UserRepository from '../repositories/user_repository'
import cache from '../utils/cache'
import { getContentHtml } from '../utils/email_template'
import { generateCode } from '../utils/generate_code'
import { sendEmail } from '../utils/nodemailer_service'
import bcrypt from 'bcrypt'

interface IAuthService {
  register: (data: UserCreate) => Promise<UserResRegister>
  validateCode: (
    data: UserLogin
  ) => Promise<{ user: UserResRegister; token: string }>
  login: (data: RequestCode) => Promise<UserResLogin>
  resendCode: (email: string) => Promise<null>
}

class AuthService
  extends Service<User, UserRepository>
  implements IAuthService
{
  constructor() {
    super(new UserRepository())
  }

  private async verifyEmail(id: string): Promise<void> {
    await this.update(id, { email_verification: true }, 'El usuario no existe')
  }

  private async generateVerifyCode(email: string, name: string): Promise<void> {
    const codeToken = generateCode()
    const contentHtml = getContentHtml(name, codeToken)
    const [success, message] = await sendEmail(
      `'ABS Mailer' <${process.env.NODEMAILER_EMAIL ?? ''}>`,
      email,
      'Codigo de verificación de One Hundred Dates',
      contentHtml
    )
    if (!success) {
      throw new ServerError(message)
    }
    cache.set(`code_token_${email}`, codeToken)
  }

  public async register(data: UserCreate): Promise<UserResRegister> {
    // Validate if user exist by name and email
    await Promise.all([
      this.repository.existUserByName(data.name),
      this.repository.existUserByEmail(data.email)
    ])

    const user = await this.create({
      ...data,
      name: data.name,
      email: data.email.toLowerCase()
    })
    await this.generateVerifyCode(user.email, user.name)
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }

  public async validateCode(
    data: UserLogin
  ): Promise<{ user: UserResRegister; token: string }> {
    const email = data.email
    const keyCache = `code_token_${email.toLowerCase()}`

    const codeCache = cache.get(keyCache)
    if (codeCache === undefined) {
      throw new PermissionDeniedError('El codigo de verificación ha expirado')
    }

    if (String(codeCache) !== data.code_token) {
      throw new BadRequestError('El codigo de verificación es incorrecto')
    }

    const user = await this.repository.getUserByEmail(email)
    const token = createToken(user.id)
    cache.delete(keyCache)

    await this.verifyEmail(user.id)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    }
  }

  public async login(data: RequestCode): Promise<UserResLogin> {
    const user = await this.repository.getUserByEmail(data.email, true)
    if (!bcrypt.compareSync(data.password, user.password)) {
      throw new NotAuthorizedError('La contraseña es incorrecta')
    }

    if (!user.email_verification) {
      await this.generateVerifyCode(user.email, user.name)
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          email_verification: user.email_verification
        },
        token: null
      }
    }

    const token = createToken(user.id)
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verification: user.email_verification
      },
      token
    }
  }

  public async resendCode(email: string): Promise<null> {
    const user = await this.repository.getUserByEmail(email)
    await this.generateVerifyCode(user.email.toLowerCase(), user.name)
    return null
  }
}

export default AuthService
