import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError
} from 'jsonwebtoken'
import { type NextFunction, type Request, type Response } from 'express'
import { ResponseCode, http, error } from '../helpers/request'
import { type TokenPayload } from '../interfaces/token_payload.interface'
import dayjs from 'dayjs'

interface CustomRequest extends Request {
  user_id: string
  token: string
}

export const revalidateAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

    // Validate refresh token
    const oneMinuteBefore = dayjs.unix(payload.exp).subtract(1, 'minute')
    if (dayjs().unix() >= oneMinuteBefore.unix()) {
      (req as CustomRequest).token = token;
      (req as CustomRequest).user_id = payload.user_id
      next()
      return
    }

    res
      .status(ResponseCode.OK)
      .json(http.response(null, ResponseCode.OK, 'The token is valid'))
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
