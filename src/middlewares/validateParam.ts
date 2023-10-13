import { type NextFunction, type Request, type Response } from 'express'
import { ResponseCode, http } from '../helpers/request'
import Joi from 'joi'
import { validateId, validateString } from '../validators'

export const validateParam = (type: 'uuid' | 'string' = 'uuid') => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const arrayParams = Object.keys(req.params)
      if (arrayParams.length === 0) {
        res
          .status(ResponseCode.BAD_REQUEST)
          .json(
            http.error(null, ResponseCode.BAD_REQUEST, [
              'email param is required'
            ])
          )
        return
      }

      const param = arrayParams[0]
      let schema = validateId(param)
      if (type === 'string') {
        schema = validateString(param)
      }
      await schema.validateAsync({ [param]: req.params[param] })
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
