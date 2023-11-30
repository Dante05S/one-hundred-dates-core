import dayjs from 'dayjs'
import Service from '.'
import type CodeToken from '../database/models/codeToken'
import CodeTokenRepository from '../repositories/code_token_repository'
import { generateCode } from '../utils/generate_code'
import {
  BadRequestError,
  PermissionDeniedError
} from '../helpers/exceptions_errors'

interface ICodeTokenService {
  generate: (idUser: string) => Promise<string>
  verify: (idUser: string, code: string) => Promise<void>
}

class CodeTokenService
  extends Service<CodeToken, CodeTokenRepository>
  implements ICodeTokenService
{
  constructor() {
    super(new CodeTokenRepository())
  }

  public async generate(idUser: string): Promise<string> {
    await this.repository.removeByUserId(idUser)
    const codeGenerate = generateCode()
    const expire = dayjs().add(5, 'minute').toDate()
    const codeToken = await this.create({
      code: String(codeGenerate),
      expire_at: expire,
      user_id: idUser
    })
    return codeToken.code
  }

  public async verify(idUser: string, code: string): Promise<void> {
    const codeToken = await this.getOne(
      {
        user_id: idUser
      },
      'El codigo de verificación ha expirado'
    )

    const actTime = dayjs()
    const expirationDate = dayjs(codeToken.expire_at)

    if (!actTime.isBefore(expirationDate)) {
      await this.remove(codeToken.id, 'El codigo de verificación no existe')
      throw new PermissionDeniedError('El codigo de verificación ha expirado')
    }

    if (codeToken.code !== code) {
      throw new BadRequestError('El codigo de verificación es incorrecto')
    }

    await this.remove(codeToken.id, 'El codigo de verificación no existe')
  }
}

export default CodeTokenService
