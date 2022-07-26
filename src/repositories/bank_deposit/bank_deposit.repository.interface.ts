import { BankDeposit } from '../../models/bank_deposit'

export interface BankDepositRepositoryInterface {
  save: (data: { accountId: number, amount: number }) => Promise<BankDeposit>
}
