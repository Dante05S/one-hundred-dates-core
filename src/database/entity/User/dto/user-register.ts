import type { User } from '..'

export type UserRegister = Pick<User, 'name' | 'email' | 'password'>

export type UserResRegister = Pick<User, 'name' | 'email'>
