import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BankAccount } from './bank_account'

@Entity('bank_transfer')
export class BankTransfer {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'origin_account_id' })
    originAccountId!: number

  @JoinColumn({ name: 'origin_account_id' })
  @ManyToOne(() => BankAccount)
    originAccount?: BankAccount

  @Column({ name: 'destination_account_id' })
    destinationAccountId!: number

  @JoinColumn({ name: 'destination_account_id' })
  @ManyToOne(() => BankAccount)
    destinationAccount?: BankAccount

  @Column()
    amount!: number

  @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date
}
