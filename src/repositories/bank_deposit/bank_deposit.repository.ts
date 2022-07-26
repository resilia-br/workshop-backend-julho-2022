import { AppDataSource } from '../../database/data-source'
import { BankDeposit } from '../../models/bank_deposit'
import { BankDepositRepositoryInterface } from './bank_deposit.repository.interface'

export class BankDepositRepository implements BankDepositRepositoryInterface {
  constructor (private readonly repository = AppDataSource.getRepository(BankDeposit)) {}

  async save (data: { accountId: number, amount: number }): Promise<BankDeposit> {
    return await this.repository.save(data)
  }
}
