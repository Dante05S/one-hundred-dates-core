import { type Model } from 'sequelize'

export type QueryUpdate<T extends Model> = [number, T[]]
