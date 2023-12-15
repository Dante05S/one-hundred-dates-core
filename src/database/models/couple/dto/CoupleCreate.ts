import { type ICouple } from '..'

export interface CoupleCreate
  extends Pick<ICouple, 'id' | 'user_a_id' | 'user_b_id'> {}
