import { type IUser } from '..'

export type RequestCode = Pick<IUser, 'email' | 'password'>
