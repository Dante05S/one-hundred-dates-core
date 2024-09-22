import { Entity, Column, Unique } from 'typeorm'
import { BaseAttributes } from '../../../services'
import { TypeCouple } from '../../../enums/type-couple'

@Entity()
@Unique(['email', 'name'])
export class User extends BaseAttributes {
  @Column({ nullable: false, default: '' })
  name!: string

  @Column({
    nullable: false,
    default: ''
  })
  email!: string

  @Column({ nullable: false, default: '' })
  password!: string

  @Column({ type: 'enum', enum: TypeCouple, nullable: true })
  type_couple!: TypeCouple

  @Column({ nullable: true })
  refresh_token!: string
}
