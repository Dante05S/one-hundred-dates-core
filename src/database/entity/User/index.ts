import { Entity, Column, Unique, OneToOne } from 'typeorm'
import { BaseAttributes } from '../../../services'
import { TypeCouple } from '../../../enums/type-couple'
import { CodeToken } from '../CodeToken'
import { Couple } from '../Couple'

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
  type_couple!: TypeCouple | null

  @Column({ type: 'varchar', nullable: true })
  refresh_token!: string | null

  @Column({ type: 'varchar', nullable: true })
  temp_couple_code!: string | null

  @OneToOne(() => CodeToken, (codeToken) => codeToken.user)
  code_token!: CodeToken

  @OneToOne(() => Couple, (couple) => couple.user_a)
  couple_a!: Couple

  @OneToOne(() => Couple, (couple) => couple.user_b)
  couple_b!: Couple
}
