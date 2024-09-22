import { type User } from '..'

export type UserCouple = Pick<User, 'name' | 'email' | 'type_couple'>
