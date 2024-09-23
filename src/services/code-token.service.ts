import dayjs from 'dayjs'
import Service, { type IService } from '.'
import { generateCode } from '../utils/generate-code'
import { CodeTokenRepository } from '../repositories/code-token.repository'
import {
  BadRequestError,
  PermissionDeniedError
} from '../helpers/exceptions-errors'
import { type CodeToken } from '../database/entity/CodeToken'

interface ICodeTokenService extends IService<CodeToken> {
  generate: (idUser: string) => Promise<string>
  verify: (idUser: string, code: string) => Promise<void>
}

class CodeTokenService
  extends Service<CodeToken, typeof CodeTokenRepository>
  implements ICodeTokenService
{
  constructor() {
    super(CodeTokenRepository)
  }

  public async generate(idUser: string): Promise<string> {
    await this.repository.removeByUserId(idUser)
    const code = String(generateCode())
    const expire = dayjs().add(5, 'minute').toDate()
    await this.create({
      code,
      expire_at: expire,
      user_id: idUser
    })
    return code
  }

  public async verify(idUser: string, code: string): Promise<void> {
    const codeToken = await this.getOne(
      {
        user_id: idUser
      },
      'El codigo de verificación ha expirado',
      ['id', 'expire_at', 'code']
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
