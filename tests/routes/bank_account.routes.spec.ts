/* eslint-disable import/first */
import request from 'supertest'

const mockFindByCpf = jest.fn()
const mockSaveAccount = jest.fn()
const mockFindById = jest.fn()
const mockSaveAll = jest.fn()

jest.mock('../../src/repositories/bank_account/bank_account.repository', () => {
  return {
    BankAccountRepository: jest.fn().mockImplementation(() => ({
      findByCpf: mockFindByCpf,
      save: mockSaveAccount,
      findById: mockFindById,
      saveAll: mockSaveAll
    }))
  }
})

const mockSaveTransfer = jest.fn()
jest.mock('../../src/repositories/bank_transfer/bank_transfer.repository', () => {
  return {
    BankTransferRepository: jest.fn().mockImplementation(() => ({
      save: mockSaveTransfer
    }))
  }
})

const mockSaveDeposit = jest.fn()
jest.mock('../../src/repositories/bank_deposit/bank_deposit.repository', () => {
  return {
    BankDepositRepository: jest.fn().mockImplementation(() => ({
      save: mockSaveDeposit
    }))
  }
})

import { app } from '../../src/app'

describe('Account Routes', () => {
  describe('POST /accounts', () => {
    const requestBody = {
      name: 'any_name',
      cpf: 'any_cpf'
    }
    const saveAccountResponse = {
      id: 1,
      name: 'any_name',
      cpf: ' any_cpf'
    }

    beforeAll(() => {
      mockFindByCpf.mockResolvedValue(null)
      mockSaveAccount.mockResolvedValue(saveAccountResponse)
    })

    it('Should return 400 if params are invalid', async () => {
      const { status, body } = await request(app)
        .post('/api/accounts')
        .send({
          name: 'any_name'
        })

      expect(status).toBe(400)
      expect(body).toBeDefined()
    })

    it('Should return 500 if an error occurs', async () => {
      mockFindByCpf.mockRejectedValueOnce(new Error())

      const { status, body } = await request(app)
        .post('/api/accounts')
        .send(requestBody)

      expect(status).toBe(500)
      expect(body).toBeDefined()
    })

    it('Should return 201 and created account on success', async () => {
      const { status, body } = await request(app)
        .post('/api/accounts')
        .send(requestBody)

      expect(status).toBe(201)
      expect(body).toEqual(saveAccountResponse)
    })
  })

  describe('POST /accounts/transfer', () => {
    const requestBody = {
      originAccountId: 1,
      destinationAccountId: 2,
      amount: 20
    }
    const findByIdResponse = {
      id: 1,
      name: 'any_name',
      cpf: ' any_cpf'
    }
    const saveAllResponse = [{
      id: 1,
      name: 'any_name',
      cpf: ' any_cpf'
    }]
    const saveTransferResponse = {
      id: 1,
      originAccountId: 1,
      destinationAccountId: 2,
      amount: 30
    }

    beforeAll(() => {
      mockFindById.mockResolvedValue(findByIdResponse)
      mockSaveAll.mockResolvedValue(saveAllResponse)
      mockSaveTransfer.mockResolvedValue(saveTransferResponse)
    })

    it('Should return 400 if params are invalid', async () => {
      const { status, body } = await request(app)
        .post('/api/accounts/transfer')
        .send({})

      expect(status).toBe(400)
      expect(body).toBeDefined()
    })

    it('Should return 500 if an error occurs', async () => {
      mockFindById.mockRejectedValueOnce(new Error())

      const { status, body } = await request(app)
        .post('/api/accounts/transfer')
        .send(requestBody)

      expect(status).toBe(500)
      expect(body).toBeDefined()
    })

    it('Should return 204 on success', async () => {
      const { status, body } = await request(app)
        .post('/api/accounts/transfer')
        .send(requestBody)

      expect(status).toBe(204)
      expect(body).toEqual({})
    })
  })

  describe('POST /accounts/deposit', () => {
    const requestBody = {
      accountId: 1,
      amount: 20
    }
    const findByIdResponse = {
      id: 1,
      name: 'any_name',
      cpf: ' any_cpf'
    }
    const saveAccountResponse = {
      id: 1,
      name: 'any_name',
      cpf: ' any_cpf'
    }
    const saveDepositResponse = {
      id: 1,
      accountId: 1,
      amount: 30
    }

    beforeAll(() => {
      mockFindById.mockResolvedValue(findByIdResponse)
      mockSaveAccount.mockResolvedValue(saveAccountResponse)
      mockSaveDeposit.mockResolvedValue(saveDepositResponse)
    })

    it('Should return 400 if params are invalid', async () => {
      const { status, body } = await request(app)
        .post('/api/accounts/deposit')
        .send({})

      expect(status).toBe(400)
      expect(body).toBeDefined()
    })

    it('Should return 500 if an error occurs', async () => {
      mockFindById.mockRejectedValueOnce(new Error())

      const { status, body } = await request(app)
        .post('/api/accounts/deposit')
        .send(requestBody)

      expect(status).toBe(500)
      expect(body).toBeDefined()
    })

    it('Should return 204 on success', async () => {
      const { status, body } = await request(app)
        .post('/api/accounts/deposit')
        .send(requestBody)

      expect(status).toBe(204)
      expect(body).toEqual({})
    })
  })
})
