import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('bank_account')
export class BankAccount {
  @PrimaryGeneratedColumn()
    id!: number

  @Column()
    name!: string

  @Column({ unique: true })
    cpf!: string

  @Column()
    amount!: number

  @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date
}
