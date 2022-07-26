import { BankDepositDTO } from '../dtos/bank_deposit.dto'
import { BankTransferDTO } from '../dtos/bank_transfer.dto'
import { CreateBankAccountDTO } from '../dtos/create_bank_account.dto'
import { BankAccount } from '../models/bank_account'

export interface BankAccountServiceInterface {
  createAccount: (params: CreateBankAccountDTO) => Promise<BankAccount>

  transfer: (params: BankTransferDTO) => Promise<void>

  deposit: (params: BankDepositDTO) => Promise<void>
}
