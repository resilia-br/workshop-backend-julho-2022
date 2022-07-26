import { BankAccount } from '../../models/bank_account'

export interface BankAccountRepositoryInterface {
  findByCpf: (cpf: string) => Promise<BankAccount | null>

  save: (data: { name: string, cpf: string, amount: number }) => Promise<BankAccount>

  findById: (id: number) => Promise<BankAccount | null>

  saveAll: (data: Array<{ name: string, cpf: string, amount: number }>) => Promise<BankAccount[]>
}
