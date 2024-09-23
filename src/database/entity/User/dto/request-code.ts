import type { User } from '..'

export type RequestCode = Pick<User, 'email' | 'password'>
