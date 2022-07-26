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
    const account = await this.accountRepository.findByCpf(params.cpf)

    if (account != null) {
      throw new Error('Conta já existe para esse CPF')
    }

    return await this.accountRepository.save({ ...params, amount: 0 })
  }

  async transfer (params: BankTransferDTO): Promise<void> {
    const originAccount = await this.accountRepository.findById(params.originAccountId)

    if (originAccount == null) {
      throw new Error('Conta origem inválida')
    }
    if (originAccount.amount < params.amount) {
      throw new Error('Valor de transferência maior que o saldo da conta origem')
    }

    const destinationAccount = await this.accountRepository.findById(params.destinationAccountId)

    if (destinationAccount == null) {
      throw new Error('Conta destino inválida')
    }

    originAccount.amount -= params.amount
    destinationAccount.amount += params.amount

    await this.accountRepository.saveAll([originAccount, destinationAccount])

    await this.transferRepository.save({
      originAccountId: params.originAccountId,
      destinationAccountId: params.destinationAccountId,
      amount: params.amount
    })
  }

  async deposit (params: BankDepositDTO): Promise<void> {
    if (params.amount > 5000) {
      throw new Error('Valor do depósito não pode ser maior do que R$5.000')
    }

    const account = await this.accountRepository.findById(params.accountId)

    if (account == null) {
      throw new Error('Conta inválida')
    }

    account.amount += params.amount

    await this.accountRepository.save(account)

    await this.depositRepository.save({ accountId: account.id, amount: params.amount })
  }
}
