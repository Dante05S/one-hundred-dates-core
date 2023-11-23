import { type IUser } from '..'
import { type ExcludeDates } from '../../../../types/exclude_dates'

export type UserPassword = Omit<IUser, ExcludeDates>
