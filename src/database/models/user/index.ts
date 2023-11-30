import { DataTypes } from 'sequelize'
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Unique,
  HasOne
} from 'sequelize-typescript'
import bcrypt from 'bcrypt'
import { type BaseModelAttributes } from '../../../interfaces/base_model_attributes'
import { type UserCreate } from './dto/UserCreate'
import CodeToken from '../codeToken'

export interface IUser extends BaseModelAttributes {
  name: string
  email: string
  password: string
  email_verification: boolean
  code_token: CodeToken
}

@Table({ modelName: 'users', paranoid: false })
class User extends Model<IUser, UserCreate> {
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
  name!: string

  @Unique({
    name: 'email',
    msg: 'Ya hay un usuario registrado con este email'
  })
  @Column({
    allowNull: false,
    defaultValue: ''
  })
  email!: string

  @Column({
    allowNull: false,
    defaultValue: ''
  })
  get password(): string {
    return this.getDataValue('password')
  }

  set password(value: string) {
    this.setDataValue('password', bcrypt.hashSync(value, 12))
  }

  @Column({
    allowNull: false,
    defaultValue: false
  })
  email_verification!: boolean

  @HasOne(() => CodeToken, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  code_token!: CodeToken

  @CreatedAt
  created_at!: Date

  @UpdatedAt
  updated_at!: Date

  @DeletedAt
  deleted_at!: Date
}

export default User
