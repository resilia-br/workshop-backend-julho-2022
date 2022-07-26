import { AppDataSource } from '../../database/data-source'
import { BankTransfer } from '../../models/bank_transfer'
import { BankTransferRepositoryInterface } from './bank_transfer.repository.interface'

export class BankTransferRepository implements BankTransferRepositoryInterface {
  constructor (private readonly repository = AppDataSource.getRepository(BankTransfer)) {}

  async save (data: { originAccountId: number, destinationAccountId: number, amount: number }): Promise<BankTransfer> {
    //TODO
  }
}
