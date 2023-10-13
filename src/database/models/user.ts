import { DataTypes, type Optional } from 'sequelize'
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
import { type BaseModelAttributes } from '../../interfaces/base_model_attributes'
import { type BaseModelCreation } from '../../types/base_model_creation'
import sequelize from '../connection'

export interface IUser extends BaseModelAttributes {
  name: string
  email: string
  password: string
}

export interface UserCreation extends Optional<IUser, BaseModelCreation> {}

@Table({ modelName: 'users' })
class User extends Model<IUser, UserCreation> {
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

  @CreatedAt
  created_at!: Date

  @UpdatedAt
  updated_at!: Date

  @DeletedAt
  deleted_at!: Date
}

sequelize.addModels([User])

export default User
