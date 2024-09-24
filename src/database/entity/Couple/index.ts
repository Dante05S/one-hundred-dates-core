import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn
} from 'typeorm'
import { User } from '../User'

@Entity()
export class Couple {
  @PrimaryColumn()
  id!: string

  @Column({
    type: 'timestamp',
    nullable: true
  })
  init_date!: Date | null

  @OneToOne(() => User, (user) => user.couple_a)
  @JoinColumn({ name: 'user_a_id' })
  user_a!: User

  @Column({ nullable: false })
  user_a_id!: string

  @OneToOne(() => User, (user) => user.couple_b)
  @JoinColumn({ name: 'user_b_id' })
  user_b!: User

  @Column({ nullable: false })
  user_b_id!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
