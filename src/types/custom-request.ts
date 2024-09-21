import { type Request } from 'express'
import { type ResponseObjectData } from '../helpers/request'
import { type RolPayload } from './token-payload'

export interface CustomRequest<T = any>
  extends Request<ResponseObjectData, any, T> {
  id: string
  token: string
  type: RolPayload
}
