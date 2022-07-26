import { Router } from 'express'
import { BankAccountController } from '../controllers/bank_account.controller'

const router = Router()
const accountController = new BankAccountController()

router.post('/', (req, res) => {
  void accountController.createAccount(req, res)
})

router.post('/transfer', (req, res) => {
  void accountController.transfer(req, res)
})

router.post('/deposit', (req, res) => {
  void accountController.deposit(req, res)
})

export default router
