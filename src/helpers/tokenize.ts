import dayjs from 'dayjs'
import { ServerError } from './exceptions-errors'
import jwt from 'jsonwebtoken'
import { type TokenPayload } from '../types/token-payload'

export const createToken = (id: string): string => {
  const exp = dayjs().add(1, 'hour').unix()

  const payload: TokenPayload = {
    id,
    iat: dayjs().unix(),
    exp
  }

  if (process.env.TOKEN_SECRET_KEY === undefined) {
    throw new ServerError('The token secret is required')
  }
  return jwt.sign(payload, process.env.TOKEN_SECRET_KEY)
}

export const createRefreshToken = (id: string): string => {
  const exp = dayjs().add(1, 'month').endOf('hour').unix()

  const payload: TokenPayload = {
    id,
    iat: dayjs().unix(),
    exp
  }

  if (process.env.REFRESH_TOKEN_SECRET_KEY === undefined) {
    throw new ServerError('The refresh token secret is required')
  }
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY)
}
