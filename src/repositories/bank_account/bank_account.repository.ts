import { AppDataSource } from '../../database/data-source'
import { BankAccount } from '../../models/bank_account'
import { BankAccountRepositoryInterface } from './bank_account.repository.interface'

export class BankAccountRepository implements BankAccountRepositoryInterface {
  constructor (private readonly repository = AppDataSource.getRepository(BankAccount)) {}

  async findByCpf (cpf: string): Promise<BankAccount | null> {
    return await this.repository.findOne({
      where: {
        cpf
      }
    })
  }

  async save (data: { name: string, cpf: string, amount: number }): Promise<BankAccount> {
    return await this.repository.save(data)
  }

  async findById (id: number): Promise<BankAccount | null> {
    return await this.repository.findOne({
      where: {
        id
      }
    })
  }

  async saveAll (data: Array<{ name: string, cpf: string, amount: number }>): Promise<BankAccount[]> {
    return await this.repository.save(data)
  }
}
