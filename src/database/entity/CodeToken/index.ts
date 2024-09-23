import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'
import { User } from '../User'
import { BaseAttributes } from '../../../services'

@Entity()
export class CodeToken extends BaseAttributes {
  @Column({
    nullable: false,
    default: ''
  })
  code!: string

  @Column({
    nullable: true,
    default: null
  })
  expire_at!: Date

  @OneToOne(() => User, (user) => user.code_token)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ nullable: false })
  user_id!: string
}
