import type { UserCouple } from './user-couple'

export interface TokenUser {
  user: UserCouple
  token: string
  refresh_token: string
}
