import { type User } from '..'
import { type ResponseConnect } from '../../Couple/dto/response-connect'

export type UserCouple = Pick<User, 'id' | 'name' | 'email' | 'type_couple'> & {
  couple: ResponseConnect | null
}
