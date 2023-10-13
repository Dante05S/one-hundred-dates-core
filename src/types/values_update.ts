import { type Model, type Attributes } from 'sequelize'
import { type Col, type Fn, type Literal } from 'sequelize/types/utils'

export type ValuesUpdate<T extends Model> = {
  [key in keyof Attributes<T>]?:
    | Fn
    | Col
    | Literal
    | Attributes<T>[key]
    | undefined
}
