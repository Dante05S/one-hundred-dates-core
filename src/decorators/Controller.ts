/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type Request, type Response } from 'express'
import { CustomError, getStatusByException } from '../helpers/exceptions-errors'
import { http, ResponseCode } from '../helpers/request'

/* eslint-disable @typescript-eslint/ban-types */
export function Controller(): Function {
  return function (target: Function) {
    const prototypeController = target.prototype
    const properties = Object.getOwnPropertyNames(prototypeController)
    for (const methodName of properties) {
      if (
        typeof prototypeController[methodName] === 'function' &&
        methodName !== 'constructor'
      ) {
        const originalMethod = prototypeController[methodName]
        prototypeController[methodName] = async function (
          req: Request,
          res: Response
        ) {
          try {
            const [result, message] = await originalMethod.call(target, req)
            res
              .status(ResponseCode.OK)
              .json(http.response(result, ResponseCode.OK, message as string))
          } catch (e) {
            const statusCode = getStatusByException(e)
            const data = e instanceof CustomError ? e.data : null
            const errors = [(e as Error).message]
            res.status(statusCode).json(http.error(data, statusCode, errors))
          }
        }
      }
    }
  }
}
