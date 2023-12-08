import { type IUser } from '..'

export interface UserResLogin {
  user: Pick<IUser, 'id' | 'name' | 'email' | 'email_verification'>
  token: string | null
}
