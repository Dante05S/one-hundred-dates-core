import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError
} from 'jsonwebtoken'
import { ResponseCode, error, http } from '../helpers/request'
import { type NextFunction, type Request, type Response } from 'express'
import { type TokenPayload } from '../types/token-payload'
import { type CustomRequest } from '../types/custom-request'
import { UserRepository } from '../repositories/user.repository'
import { NotAuthorizedError } from '../helpers/exceptions-errors'

export const authRefresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.headers.authorization === undefined) {
      res
        .status(ResponseCode.NOT_AUTHORIZED)
        .send(error.authorizationHeaderDoesntExist)
      return
    }
    const bearer = req.headers.authorization.split(' ')[0]

    if (bearer !== 'Bearer') {
      res.status(ResponseCode.NOT_AUTHORIZED).send(error.invalidBodyToken)
      return
    }

    const token = req.headers.authorization.split(' ')[1]
    const payload = jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY ?? ''
    ) as TokenPayload

    const user = await UserRepository.findOne({
      where: { id: payload.id, refresh_token: token },
      select: ['id']
    })

    if (user === null) {
      throw new NotAuthorizedError('Invalid Token')
    }

    (req as unknown as CustomRequest).token = token;
    (req as unknown as CustomRequest).id = payload.id

    next()
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      res.status(ResponseCode.NOT_AUTHORIZED).send(error.expiredToken)
      return
    }
    if (e instanceof JsonWebTokenError || e instanceof NotBeforeError) {
      res
        .status(ResponseCode.NOT_AUTHORIZED)
        .send(error.invalidToken(e.message))
      return
    }
    res
      .status(ResponseCode.SERVER_ERROR)
      .send(http.error(null, ResponseCode.SERVER_ERROR, [(e as Error).message]))
  }
}
