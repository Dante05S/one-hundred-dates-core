import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError
} from 'jsonwebtoken'
import { ResponseCode, error, http } from '../helpers/request'
import { type NextFunction, type Request, type Response } from 'express'
import { type TokenPayload } from '../interfaces/token_payload.interface'

interface CustomRequest extends Request {
  user_id: string
  token: string
}

export const authenticate = (
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

    (req as CustomRequest).token = token;
    (req as CustomRequest).user_id = payload.user_id

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
