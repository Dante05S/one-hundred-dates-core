import { type Model } from 'sequelize'

export interface QueryCount<T extends Model> {
  rows: T[]
  count: number
}
