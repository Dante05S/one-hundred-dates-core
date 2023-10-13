import { type Attributes, type FindOptions, type Model } from 'sequelize'

export type Options<T extends Model> = FindOptions<Attributes<T>>
