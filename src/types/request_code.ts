import { type IUser } from '../database/models/user'

export type RequestCode = Pick<IUser, 'email' | 'password'>
