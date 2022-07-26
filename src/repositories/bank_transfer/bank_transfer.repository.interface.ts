import { BankTransfer } from '../../models/bank_transfer'

export interface BankTransferRepositoryInterface {
  save: (data: { originAccountId: number, destinationAccountId: number, amount: number }) => Promise<BankTransfer>
}
