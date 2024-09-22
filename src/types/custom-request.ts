import { type Request } from 'express'
import { type ResponseObjectData } from '../helpers/request'

export interface CustomRequest<T = any>
  extends Request<ResponseObjectData, any, T> {
  id: string
  token: string
}
