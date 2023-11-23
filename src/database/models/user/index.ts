import { DataTypes } from 'sequelize'
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Unique
} from 'sequelize-typescript'
import bcrypt from 'bcrypt'
import { type BaseModelAttributes } from '../../../interfaces/base_model_attributes'
import sequelize from '../../connection'
import { type UserCreate } from './dto/UserCreate'

export interface IUser extends BaseModelAttributes {
  name: string
  email: string
  password: string
  email_verification: boolean
}

@Table({ modelName: 'users' })
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

  @CreatedAt
  created_at!: Date

  @UpdatedAt
  updated_at!: Date

  @DeletedAt
  deleted_at!: Date
}

sequelize.addModels([User])

export default User
