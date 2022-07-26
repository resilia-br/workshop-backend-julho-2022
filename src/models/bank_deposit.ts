import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BankAccount } from './bank_account'

@Entity('bank_deposit')
export class BankDeposit {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'account_id' })
    accountId!: number

  @JoinColumn({ name: 'account_id' })
  @ManyToOne(() => BankAccount)
    account?: BankAccount

  @Column()
    amount!: number

  @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date
}
