import { BankDepositDTO } from '../dtos/bank_deposit.dto'
import { BankTransferDTO } from '../dtos/bank_transfer.dto'
import { CreateBankAccountDTO } from '../dtos/create_bank_account.dto'
import { BankAccount } from '../models/bank_account'
import { BankAccountRepository } from '../repositories/bank_account/bank_account.repository'
import { BankAccountRepositoryInterface } from '../repositories/bank_account/bank_account.repository.interface'
import { BankDepositRepository } from '../repositories/bank_deposit/bank_deposit.repository'
import { BankDepositRepositoryInterface } from '../repositories/bank_deposit/bank_deposit.repository.interface'
import { BankTransferRepository } from '../repositories/bank_transfer/bank_transfer.repository'
import { BankTransferRepositoryInterface } from '../repositories/bank_transfer/bank_transfer.repository.interface'
import { BankAccountServiceInterface } from './bank_account.service.interface'

export class BankAccountService implements BankAccountServiceInterface {
  accountRepository: BankAccountRepositoryInterface
  transferRepository: BankTransferRepositoryInterface
  depositRepository: BankDepositRepositoryInterface

  constructor (accountRepository?: BankAccountRepositoryInterface, transferRepository?: BankTransferRepositoryInterface, depositRepository?: BankDepositRepositoryInterface) {
    this.accountRepository = accountRepository ?? new BankAccountRepository()
    this.transferRepository = transferRepository ?? new BankTransferRepository()
    this.depositRepository = depositRepository ?? new BankDepositRepository()
  }

  async createAccount (params: CreateBankAccountDTO): Promise<BankAccount> {
    //TODO
  }

  async transfer (params: BankTransferDTO): Promise<void> {
    //TODO
  }

  async deposit (params: BankDepositDTO): Promise<void> {
    //TODO
  }
}
