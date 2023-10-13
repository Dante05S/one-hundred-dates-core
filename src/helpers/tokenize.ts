import dayjs from 'dayjs'
import { type TokenPayload } from '../interfaces/token_payload.interface'
import jwt from 'jsonwebtoken'
import { ServerError } from './exceptions_errors'

export const createToken = (userId: string): string => {
  const payload: TokenPayload = {
    user_id: userId,
    pusher_channel: `USER_${userId}`,
    iat: dayjs().unix(),
    exp: dayjs().add(2, 'minute').endOf('minute').unix()
  }
  if (process.env.TOKEN_SECRET_KEY === undefined) {
    throw new ServerError('The token secret is required')
  }
  return jwt.sign(payload, process.env.TOKEN_SECRET_KEY)
}
