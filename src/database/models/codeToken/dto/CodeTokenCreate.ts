import { type ICodeToken } from '..'
import { type BaseModelAttributes } from '../../../../interfaces/base_model_attributes'

export interface CodeTokenCreate
  extends Omit<ICodeToken, keyof BaseModelAttributes | 'user'> {}
