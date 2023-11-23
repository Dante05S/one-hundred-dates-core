import { type IUser } from '..'
import { type BaseModelAttributes } from '../../../../interfaces/base_model_attributes'

export interface UserCreate extends Omit<IUser, keyof BaseModelAttributes> {}
