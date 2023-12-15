import { type NextFunction, type Request, type Response } from 'express'
import { ResponseCode, http, error } from '../helpers/request'
import Joi from 'joi'

export const validateBody = (schema: Joi.ObjectSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!http.isApplicationJson(req)) {
        res.status(ResponseCode.BAD_REQUEST).send(error.contentTypeIsInvalid)
        return
      }
      await schema.validateAsync(req.body)
      next()
    } catch (e) {
      if (e instanceof Joi.ValidationError) {
        const errors = e.details.map((detail) => detail.message)
        res
          .status(ResponseCode.BAD_REQUEST)
          .json(http.error(null, ResponseCode.BAD_REQUEST, errors))
        return
      }
      res
        .status(ResponseCode.SERVER_ERROR)
        .json(
          http.error(null, ResponseCode.BAD_REQUEST, [(e as Error).message])
        )
    }
  }
}
