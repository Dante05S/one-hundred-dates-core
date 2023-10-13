import { type NextFunction, type Request, type Response } from 'express'
import { ResponseCode, http, error } from '../helpers/request'

export const contentType = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!http.isApplicationJson(req)) {
    res.status(ResponseCode.BAD_REQUEST).send(error.contentTypeIsInvalid)
    return
  }
  next()
}
