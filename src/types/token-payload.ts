export type RolPayload = 'USER' | 'ADMIN'

export interface TokenPayload {
  id: string
  type: RolPayload
  pusher_channel: string
  exp: number
  iat: number
}
