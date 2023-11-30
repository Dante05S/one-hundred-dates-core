import { DataTypes } from 'sequelize'
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript'
import { type BaseModelAttributes } from '../../../interfaces/base_model_attributes'
import { type CodeTokenCreate } from './dto/CodeTokenCreate'
import User from '../user'

export interface ICodeToken extends BaseModelAttributes {
  code: string
  expire_at: Date
  user_id: string
  user: User
}

@Table({ modelName: 'code_tokens', paranoid: false })
class CodeToken extends Model<ICodeToken, CodeTokenCreate> {
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  })
  readonly id!: string

  @Column({
    allowNull: false,
    defaultValue: ''
  })
  code!: string

  @Column({
    allowNull: true,
    defaultValue: null
  })
  expire_at!: Date

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataTypes.UUID
  })
  user_id!: string

  @BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user!: User

  @CreatedAt
  created_at!: Date

  @UpdatedAt
  updated_at!: Date

  @DeletedAt
  deleted_at!: Date
}

export default CodeToken
