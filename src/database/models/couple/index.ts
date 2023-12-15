import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  PrimaryKey,
  Table,
  Model,
  UpdatedAt
} from 'sequelize-typescript'
import { type BaseModelAttributes } from '../../../interfaces/base_model_attributes'
import { DataTypes } from 'sequelize'
import { type CoupleCreate } from './dto/CoupleCreate'
import User from '../user'

export interface ICouple extends BaseModelAttributes {
  user_a_id: string
  user_b_id: string
  init_date: Date
  user_a: User
  user_b: User
}

@Table({ modelName: 'couples', paranoid: false })
class Couple extends Model<ICouple, CoupleCreate> {
  @PrimaryKey
  @Column({
    allowNull: false
  })
  id!: string

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataTypes.UUID
  })
  user_a_id!: string

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataTypes.UUID
  })
  user_b_id!: string

  @Column({
    allowNull: true,
    defaultValue: null
  })
  init_date!: Date

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  user_a!: User

  @BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user_b!: User

  @CreatedAt
  created_at!: Date

  @UpdatedAt
  updated_at!: Date

  @DeletedAt
  deleted_at!: Date
}

export default Couple
