import { mock } from 'jest-mock-extended'
import { BankAccountRepositoryInterface } from '../../src/repositories/bank_account/bank_account.repository.interface'
import { BankDepositRepositoryInterface } from '../../src/repositories/bank_deposit/bank_deposit.repository.interface'
import { BankTransferRepositoryInterface } from '../../src/repositories/bank_transfer/bank_transfer.repository.interface'
import { BankAccountService } from '../../src/services/bank_account.service'

describe('Bank Account Service', () => {
  let sut: BankAccountService
  const accountRepository = mock<BankAccountRepositoryInterface>()
  const transferRepository = mock<BankTransferRepositoryInterface>()
  const depositRepository = mock<BankDepositRepositoryInterface>()

  beforeEach(() => {
    sut = new BankAccountService(accountRepository, transferRepository, depositRepository)
  })

  describe('Create Bank Account', () => {
    const createAccountParams = {
      name: 'any_name',
      cpf: 'any_cpf'
    }
    const saveAccountResponse = {
      id: 1,
      name: 'any_name',
      cpf: 'any_cpf',
      amount: 10,
      createdAt: new Date()
    }

    beforeAll(() => {
      accountRepository.findByCpf.mockResolvedValue(null)
      accountRepository.save.mockResolvedValue(saveAccountResponse)
    })

    it('Should call findByCpf with correct value', async () => {
      await sut.createAccount(createAccountParams)

      expect(accountRepository.findByCpf).toHaveBeenCalledTimes(1)
      expect(accountRepository.findByCpf).toHaveBeenCalledWith(createAccountParams.cpf)
    })

    it('Should throw if an account already exists', async () => {
      //TODO
    })

    it('Should call save with correct values', async () => {
      await sut.createAccount(createAccountParams)

      expect(accountRepository.save).toHaveBeenCalledTimes(1)
      expect(accountRepository.save).toHaveBeenCalledWith({ name: createAccountParams.name, cpf: createAccountParams.cpf, amount: 0 })
    })

    it('Should return created account on success', async () => {
      //TODO
    })
  })

  describe('Bank Transfer', () => {
    jest.useFakeTimers().setSystemTime()
    const transferParams = {
      originAccountId: 1,
      destinationAccountId: 2,
      amount: 20
    }
    const findByIdResponse = {
      id: 1,
      name: 'any_name',
      cpf: 'any_cpf',
      amount: 30,
      createdAt: new Date()
    }
    const saveAllResponse = [{
      id: 1,
      name: 'any_name',
      cpf: 'any_cpf',
      amount: 10,
      createdAt: new Date()
    }]
    const saveTransferResponse = {
      id: 1,
      originAccountId: 1,
      destinationAccountId: 2,
      amount: 30
    }

    beforeAll(() => {
      accountRepository.findById.mockResolvedValue(findByIdResponse)
      accountRepository.saveAll.mockResolvedValue(saveAllResponse)
      void transferRepository.save(saveTransferResponse)
    })

    it('Should call findByCpf when searching for origin and destination account with correct values', async () => {
      accountRepository.findById
        .mockResolvedValueOnce({
          id: 1,
          name: 'any_name',
          cpf: 'any_cpf',
          amount: 30,
          createdAt: new Date()
        })
        .mockResolvedValueOnce({
          id: 2,
          name: 'any_name',
          cpf: 'any_cpf',
          amount: 30,
          createdAt: new Date()
        })

      await sut.transfer(transferParams)

      expect(accountRepository.findById).toHaveBeenCalledTimes(2)
      expect(accountRepository.findById).toHaveBeenCalledWith(transferParams.originAccountId)
      expect(accountRepository.findById).toHaveBeenCalledWith(transferParams.destinationAccountId)
    })

    it('Should throw if origin account was not found', async () => {
      //TODO
    })

    it('Should throw if amount of origin account is lower than amount transfered', async () => {
      //TODO
    })

    it('Should throw if destination account was not found', async () => {
      //TODO
    })

    it('Should call saveAll with updateds amount', async () => {
      accountRepository.findById.mockResolvedValueOnce({
        id: 1,
        name: 'any_name',
        cpf: 'any_cpf',
        amount: 30,
        createdAt: new Date()
      })

      await sut.transfer(transferParams)

      expect(accountRepository.saveAll).toHaveBeenCalledWith([{ ...findByIdResponse, amount: 10 }, { ...findByIdResponse, amount: 50 }])
    })

    it('Should call save with correct values', async () => {
      //TODO
    })
  })

  describe('Bank Deposit', () => {
    const depositParams = {
      accountId: 1,
      amount: 30
    }
    const findByIdResponse = {
      id: 1,
      name: 'any_name',
      cpf: 'any_cpf',
      amount: 30,
      createdAt: new Date()
    }
    const saveAccountResponse = {
      id: 1,
      name: 'any_name',
      cpf: 'any_cpf',
      amount: 10,
      createdAt: new Date()
    }
    const saveDepositResponse = {
      id: 1,
      accountId: 1,
      amount: 10,
      createdAt: new Date()
    }

    beforeAll(() => {
      accountRepository.findById.mockResolvedValue(findByIdResponse)
      accountRepository.save.mockResolvedValue(saveAccountResponse)
      depositRepository.save.mockResolvedValue(saveDepositResponse)
    })

    it('Should throw if amount is greater than R$5.000', async () => {
      //TODO
    })

    it('Should call findById with correct value', async () => {
      await sut.deposit(depositParams)

      expect(accountRepository.findById).toHaveBeenCalledTimes(1)
      expect(accountRepository.findById).toHaveBeenCalledWith(depositParams.accountId)
    })

    it('Should throw if account was not found', async () => {
      //TODO
    })

    it('Should call saveAll with updated amount', async () => {
      //TODO
    })

    it('Should call save with correct values', async () => {
      //TODO
    })
  })
})
