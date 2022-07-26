import { Request, Response } from 'express'
import { BankAccountService } from '../services/bank_account.service'
import { BankAccountServiceInterface } from '../services/bank_account.service.interface'

export class BankAccountController {
  accountService: BankAccountServiceInterface

  constructor (accountService?: BankAccountServiceInterface) {
    this.accountService = accountService ?? new BankAccountService()
  }

  async createAccount (req: Request, res: Response): Promise<Response> {
    try {
      const { name, cpf } = req.body

      if (!name || !cpf) {
        return res.status(400).send({ message: 'Parametros invalidos' })
      }

      const account = await this.accountService.createAccount({ name, cpf })

      return res.status(201).send(account)
    } catch (error) {
      let errorMessage = 'Erro ao criar conta'
      if (error instanceof Error) {
        errorMessage += `: ${error?.message}`
      }

      return res.status(500).json({ message: errorMessage })
    }
  }

  async transfer (req: Request, res: Response): Promise<Response> {
    try {
      const { originAccountId, destinationAccountId, amount } = req.body

      if (!originAccountId || !destinationAccountId || !amount || amount < 0) {
        return res.status(400).send({ message: 'Parametros invalidos' })
      }

      await this.accountService.transfer({ originAccountId, destinationAccountId, amount })

      return res.status(204).send()
    } catch (error) {
      let errorMessage = 'Erro ao tranferir dinheiro'
      if (error instanceof Error) {
        errorMessage += `: ${error?.message}`
      }

      return res.status(500).json({ message: errorMessage })
    }
  }

  async deposit (req: Request, res: Response): Promise<Response> {
    try {
      const { accountId, amount } = req.body

      if (!accountId || !amount || amount < 0) {
        return res.status(400).send({ message: 'Parametros invalidos' })
      }

      await this.accountService.deposit({ accountId, amount })

      return res.status(204).send()
    } catch (error) {
      let errorMessage = 'Erro ao depositar dinheiro'
      if (error instanceof Error) {
        errorMessage += `: ${error?.message}`
      }

      return res.status(500).json({ message: errorMessage })
    }
  }
}
