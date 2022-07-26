/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { BankAccount } from '../models/bank_account'
import { BankDeposit } from '../models/bank_deposit'
import { BankTransfer } from '../models/bank_transfer'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [BankAccount, BankTransfer, BankDeposit]
})
