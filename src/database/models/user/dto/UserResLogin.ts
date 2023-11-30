import { type IUser } from '..'
import { type ExcludeDates } from '../../../../types/exclude_dates'

export interface UserResLogin {
  user: Omit<IUser, ExcludeDates | 'password' | 'code_token'>
  token: string | null
}
