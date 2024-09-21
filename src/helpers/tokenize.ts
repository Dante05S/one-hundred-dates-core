import dayjs from 'dayjs'
import { ServerError } from './exceptions-errors'
import jwt from 'jsonwebtoken'
import { type RolPayload, type TokenPayload } from '@/types/token-payload'

export const createToken = (id: string, type: RolPayload): string => {
  const exp = dayjs().add(1, 'month').endOf('hour').unix()

  const payload: TokenPayload = {
    id,
    type,
    pusher_channel: `${type}_${id}`,
    iat: dayjs().unix(),
    exp
  }

  if (process.env.TOKEN_SECRET_KEY === undefined) {
    throw new ServerError('The token secret is required')
  }
  return jwt.sign(payload, process.env.TOKEN_SECRET_KEY)
}
