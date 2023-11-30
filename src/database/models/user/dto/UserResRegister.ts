import { type IUser } from '..'
import { type ExcludeDates } from '../../../../types/exclude_dates'

export type UserResRegister = Omit<
  IUser,
  ExcludeDates | 'password' | 'email_verification' | 'code_token'
>
