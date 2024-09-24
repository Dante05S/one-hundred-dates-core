import type { Couple } from '..'

export type ResponseConnect = Pick<
  Couple,
  'id' | 'init_date' | 'user_a_id' | 'user_b_id'
>
