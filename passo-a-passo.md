# Passo a passo de construção

## Configuração inicial

1. `npm init -y` para inicar o npm
2. `npm install --save-dev typescript` para instalar o typescript como dependência de desenvolvimento
3. `npx tsc --init` para criar o arquivo de configuração do typescript
4. Copie o seguinte conteúdo no arquivo `tsconfig.json`
```
{
  "compilerOptions": {
    "target": "es2021", /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "outDir": "dist", /* Specify an output folder for all emitted files. */
    "experimentalDecorators": true, /* Enable experimental support for TC39 stage 2 draft decorators. */
    "emitDecoratorMetadata": true, /* Emit design-type metadata for decorated declarations in source files. */
    "module": "commonjs", /* Specify what module code is generated. */
    "esModuleInterop": true, /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    "forceConsistentCasingInFileNames": true, /* Ensure that casing is correct in imports. */
    "strict": true, /* Enable all strict type-checking options. */
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  },
  "include": ["src", "tests"]
}
```
5. Crie o arquivo `tsconfig-build.json` na raiz do projeto e copie o seguinte conteúdo
```
{
  "extends": "./tsconfig.json",
  "exclude": ["tests"]
}
``` 
6. `npm install --save-dev eslint-config-standard-with-typescript` para instalar o eslint standard como dependência de desenvolvimento
7. Crie o arquivo `.eslintrc.json` na raiz do projeto e copie o seguinte conteúdo
```
{
  "extends": "standard-with-typescript",
  "parserOptions": {
      "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/strict-boolean-expressions": "off"
  }
}
```
8. Crie o arquivo `.eslintignore` e copie o seguinte conteúdo
```
node_modules
dist
coverage
```
9.  `npm install --save-dev jest @types/jest ts-jest jest-mock-extended` para instalar o jest como dependência de desenvolvimento
10. `npx jest --init` para criar o arquivo de configuração do jest. Escolha as opções na seguinte ordem: 
       1.  yes
       2.  no
       3.  node 
       4.  yes
       5.  babel
       6.  no
11. Copie o seguinte conteúdo no arquivo de configuração do jest `jest.config.js`
```
module.exports = {
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/database/**',
    '!<rootDir>/src/models/**',
    '!<rootDir>/src/server.ts'
  ],
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'babel',
  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>/tests',
    '<rootDir>/src'
  ],
  // A map from regular expressions to paths to transformers
  transform: {
    '\\.ts$': 'ts-jest'
  },
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true
}
```
12. `npm i --save-dev supertest @types/supertest` para instalar o supertest para os testes de integração
13. `npm i typeorm reflect-metadata pg` para instalar o typeorm como ORM e o driver do postgres para conexão com o banco de dados
14. `npm install --save-dev ts-node-dev` para instalar o ts-node-dev para fazermos o hot reload da aplicação
15. Crie os seguintes scripts no arquivo `package.json`
```
"scripts": {
    "build": "tsc -p tsconfig-build.json",
    "start": "node dist/server",
    "dev": "ts-node-dev --respawn --transpile-only --clear --poll --inspect=0.0.0.0:9001 src/server",
    "test": "jest --passWithNoTests --no-cache --runInBand",
    "test:coverage": "npm run test -- --coverage"
  },
```

16. `npm i swagger-ui-express` e `npm i --save-dev @types/swagger-ui-express` para instalar o swagger e suas tipagens para documentação da api
17. `npm i express ` e `npm i --save-dev @types/express` para instalar o express e suas tipagens
18. Crie o arquivo `Dockerfile` na raiz do projeto e coloque o seguinte conteúdo
```
FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm ci

COPY src ./src

EXPOSE 3000

CMD ["npm", "run", "dev"]
```
19. Crie o arquivo `docker-compose.yml` na raiz do projeto e coloque o seguinte conteúdo
```
version: '3.9'

networks:
  default:

services:
  database:
    image: postgres:alpine
    restart: always
    networks:
      - default
    environment:
      - POSRGRES_USER=postgres
      - POSTGRES_PASSWORD=root
      - POSTGRES_DB=resilia_workshop_backend
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - "5436:5432"
    expose:
      - "5436"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  api:
    build: .
    networks:
      - default
    env_file: .env
    volumes:
      - ./src:/app/src
    ports:
      - 3000:3000
      - 9001:9001
    depends_on:
      database:
        condition: service_healthy

volumes:
  db-data:
```
20. Crie o arquivo `.env` e cole o seguinte conteúdo
```
APP_PORT=3000
DB_HOST=database
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=resilia_workshop_backend
```

## Implementação da solução

1. Crie a pasta `src` na raiz do projeto
2. Crie a pasta `tests` na raiz do projeto
3. Dentro da pasta `src` crie a pasta `database` e o arquivo `data-source.ts` com o seguinte conteúdo
```
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

```
4. Dentro da pasta `src` crie o arquivo `app.ts` com o seguinte conteúdo
```
import express from 'express'

import initRoutes from './routes'

const app = express()

app.use(express.json())
initRoutes(app)

export { app }

```
5. Dentro da pasta `src` crie o arquivo `server.ts` com o seguinte conteúdo
```
import { AppDataSource } from './database/data-source'
import { app } from './app'

AppDataSource.initialize()
  .then(async () => {
    console.log('Banco de dados conectado')

    const port = process.env.APP_PORT
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))
  })
  .catch(e => {
    console.error(e)
  })

```

### Modelagem do banco de dados

1. Dentro da pasta `src` crie a pasta `models`
2. Dentro da pasta `models` crie os seguintes arquivos
      1. `bank_account.ts`
      ```
      import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

      @Entity('bank_account')
      export class BankAccount {
        @PrimaryGeneratedColumn()
          id!: number

        @Column()
          name!: string

        @Column({ unique: true })
          cpf!: string

        @Column()
          amount!: number

        @CreateDateColumn({ name: 'created_at' })
          createdAt!: Date
      }

      ```
      2. `bank_deposit.ts`
      ```
      import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

      import { BankAccount } from './bank_account'

      @Entity('bank_deposit')
      export class BankDeposit {
        @PrimaryGeneratedColumn()
          id!: number

        @Column({ name: 'account_id' })
          accountId!: number

        @JoinColumn({ name: 'account_id' })
        @ManyToOne(() => BankAccount)
          account?: BankAccount

        @Column()
          amount!: number

        @CreateDateColumn({ name: 'created_at' })
          createdAt!: Date
      }

      ```
      3. `bank_transfer.ts`
      ```
      import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
      import { BankAccount } from './bank_account'

      @Entity('bank_transfer')
      export class BankTransfer {
        @PrimaryGeneratedColumn()
          id!: number

        @Column({ name: 'origin_account_id' })
          originAccountId!: number

        @JoinColumn({ name: 'origin_account_id' })
        @ManyToOne(() => BankAccount)
          originAccount?: BankAccount

        @Column({ name: 'destination_account_id' })
          destinationAccountId!: number

        @JoinColumn({ name: 'destination_account_id' })
        @ManyToOne(() => BankAccount)
          destinationAccount?: BankAccount

        @Column()
          amount!: number

        @CreateDateColumn({ name: 'created_at' })
          createdAt!: Date
      }

      ```

### Repositories

Dentro de `src` crie uma pasta chamada `repositories` e siga os próximos passos.

#### Conta bancária
Dentro da pasta `repositories` crie uma pasta chamada `bank_account` e crie os seguintes arquivos:

1. `bank_account.repository.interface.ts`
```
import { BankAccount } from '../../models/bank_account'

export interface BankAccountRepositoryInterface {
  findByCpf: (cpf: string) => Promise<BankAccount | null>

  save: (data: { name: string, cpf: string, amount: number }) => Promise<BankAccount>

  findById: (id: number) => Promise<BankAccount | null>

  saveAll: (data: Array<{ name: string, cpf: string, amount: number }>) => Promise<BankAccount[]>
}

```
2. `bank_account.repository.ts`
```
import { AppDataSource } from '../../database/data-source'
import { BankAccount } from '../../models/bank_account'
import { BankAccountRepositoryInterface } from './bank_account.repository.interface'

export class BankAccountRepository implements BankAccountRepositoryInterface {
  constructor (private readonly repository = AppDataSource.getRepository(BankAccount)) {}

  async findByCpf (cpf: string): Promise<BankAccount | null> {
    return await this.repository.findOne({
      where: {
        cpf
      }
    })
  }

  async save (data: { name: string, cpf: string, amount: number }): Promise<BankAccount> {
    return await this.repository.save(data)
  }

  async findById (id: number): Promise<BankAccount | null> {
    return await this.repository.findOne({
      where: {
        id
      }
    })
  }

  async saveAll (data: Array<{ name: string, cpf: string, amount: number }>): Promise<BankAccount[]> {
    return await this.repository.save(data)
  }
}

```

#### Depósito bancário
Dentro da pasta `repositories` crie uma pasta chamada `bank_deposit` e crie os seguintes arquivos:

1. `bank_deposit.repository.interface.ts`
```
import { BankDeposit } from '../../models/bank_deposit'

export interface BankDepositRepositoryInterface {
  save: (data: { accountId: number, amount: number }) => Promise<BankDeposit>
}

```
2. `bank_deposit.repository.ts`
```
import { AppDataSource } from '../../database/data-source'
import { BankDeposit } from '../../models/bank_deposit'
import { BankDepositRepositoryInterface } from './bank_deposit.repository.interface'

export class BankDepositRepository implements BankDepositRepositoryInterface {
  constructor (private readonly repository = AppDataSource.getRepository(BankDeposit)) {}

  async save (data: { accountId: number, amount: number }): Promise<BankDeposit> {
    return await this.repository.save(data)
  }
}

```

#### Transferência bancária
Dentro da pasta `repositories` crie uma pasta chamada `bank_transfer` e crie os seguintes arquivos:

1. `bank_transfer.repository.interface.ts`
```
import { BankTransfer } from '../../models/bank_transfer'

export interface BankTransferRepositoryInterface {
  save: (data: { originAccountId: number, destinationAccountId: number, amount: number }) => Promise<BankTransfer>
}

```
2. `bank_transfer.repository.ts`
```
import { AppDataSource } from '../../database/data-source'
import { BankTransfer } from '../../models/bank_transfer'
import { BankTransferRepositoryInterface } from './bank_transfer.repository.interface'

export class BankTransferRepository implements BankTransferRepositoryInterface {
  constructor (private readonly repository = AppDataSource.getRepository(BankTransfer)) {}

  async save (data: { originAccountId: number, destinationAccountId: number, amount: number }): Promise<BankTransfer> {
    return await this.repository.save(data)
  }
}

```

### Services

Dentro da pasta `src` crie a pasta `dtos` e os seguintes arquivos:

1. `create_bank_account.dto.ts`
```
export interface CreateBankAccountDTO {
  name: string
  cpf: string
}

```
2. `bank_transfer.dto.ts`
```
export interface BankTransferDTO {
  originAccountId: number
  destinationAccountId: number
  amount: number
}

```
3. `bank_deposit.dto.ts`
```
export interface BankDepositDTO {
  accountId: number
  amount: number
}

```

Dentro da pasta `src` crie a pasta `services` e os seguintes arquivos:

1. `bank_account.service.interface.ts`
```
import { BankDepositDTO } from '../dtos/bank_deposit.dto'
import { BankTransferDTO } from '../dtos/bank_transfer.dto'
import { CreateBankAccountDTO } from '../dtos/create_bank_account.dto'
import { BankAccount } from '../models/bank_account'

export interface BankAccountServiceInterface {
  createAccount: (params: CreateBankAccountDTO) => Promise<BankAccount>

  transfer: (params: BankTransferDTO) => Promise<void>

  deposit: (params: BankDepositDTO) => Promise<void>
}

```
2. `bank_account.service.ts`
```
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

```

#### Testes

Dentro da pasta `tests` crie a pasta `services` e o arquivo `bank_account.service.test.ts` com o seguinte conteúdo:

```
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
      accountRepository.findByCpf.mockResolvedValueOnce({
        id: 1,
        name: 'any_name',
        cpf: 'any_cpf',
        amount: 10,
        createdAt: new Date()
      })

      const promise = sut.createAccount(createAccountParams)

      await expect(promise).rejects.toThrow()
    })

    it('Should call save with correct values', async () => {
      await sut.createAccount(createAccountParams)

      expect(accountRepository.save).toHaveBeenCalledTimes(1)
      expect(accountRepository.save).toHaveBeenCalledWith({ name: createAccountParams.name, cpf: createAccountParams.cpf, amount: 0 })
    })

    it('Should return created account on success', async () => {
      const response = await sut.createAccount(createAccountParams)

      expect(response).toEqual(saveAccountResponse)
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
      accountRepository.findById.mockResolvedValueOnce(null)

      const promise = sut.transfer(transferParams)

      await expect(promise).rejects.toThrow()
    })

    it('Should throw if amount of origin account is lower than amount transfered', async () => {
      accountRepository.findById.mockResolvedValueOnce({
        id: 1,
        name: 'any_name',
        cpf: 'any_cpf',
        amount: 10,
        createdAt: new Date()
      })

      const promise = sut.transfer(transferParams)

      await expect(promise).rejects.toThrow()
    })

    it('Should throw if destination account was not found', async () => {
      accountRepository.findById
        .mockResolvedValueOnce({
          id: 1,
          name: 'any_name',
          cpf: 'any_cpf',
          amount: 30,
          createdAt: new Date()
        })
        .mockResolvedValueOnce(null)

      const promise = sut.transfer(transferParams)

      await expect(promise).rejects.toThrow()
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
      await sut.transfer(transferParams)

      expect(transferRepository.save).toHaveBeenCalledWith({ originAccountId: transferParams.originAccountId, destinationAccountId: transferParams.destinationAccountId, amount: transferParams.amount })
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
      const promise = sut.deposit({ ...depositParams, amount: 5001 })

      await expect(promise).rejects.toThrow()
    })

    it('Should call findById with correct value', async () => {
      await sut.deposit(depositParams)

      expect(accountRepository.findById).toHaveBeenCalledTimes(1)
      expect(accountRepository.findById).toHaveBeenCalledWith(depositParams.accountId)
    })

    it('Should throw if account was not found', async () => {
      accountRepository.findById.mockResolvedValueOnce(null)

      const promise = sut.deposit(depositParams)

      await expect(promise).rejects.toThrow()
    })

    it('Should call saveAll with updated amount', async () => {
      accountRepository.findById.mockResolvedValueOnce({
        id: 1,
        name: 'any_name',
        cpf: 'any_cpf',
        amount: 30,
        createdAt: new Date()
      })

      await sut.deposit(depositParams)

      expect(accountRepository.save).toHaveBeenCalledTimes(1)
      expect(accountRepository.save).toHaveBeenCalledWith({ ...findByIdResponse, amount: 60 })
    })

    it('Should call save with correct values', async () => {
      await sut.deposit(depositParams)

      expect(depositRepository.save).toHaveBeenCalledWith({ accountId: depositParams.accountId, amount: depositParams.amount })
    })
  })
})

```

### Controllers

Dentro da pasta `src` crie a pasta `controllers` e o arquivo `bank_account.controller.ts` com o seguinte conteúdo:

```
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

```

### Routes

Dentro da pasta `src` crie a pasta `routes` e os seguintes arquivos: 

1. `bank_account.routes.ts`
```
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

```

2. `index.ts`
```
import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'

import { swaggerConfig } from '../docs/swagger-config'
import accountRoutes from './bank_account.routes'

export default (app: Express): void => {
  app.use('/api/accounts', accountRoutes)

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig))
}

```

#### Swagger

Dentro da pasta `src` crie a pasta `docs` e o arquivo `swagger-config.ts` com o seguinte conteúdo:
```
import paths from './paths'
import * as schemas from './schemas'

export const swaggerConfig = {
  openapi: '3.0.1',
  info: {
    version: '0.1.0',
    title: 'Resilia Workshop API'
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Local server'
    }
  ],
  paths,
  schemas: {
    ...schemas
  }
}

```

Dentro da pasta `docs` crie a pasta `paths` com os seguintes arquivos:

1. `bank_account.paths.ts`
```
export const accountPath = {
  post: {
    tags: ['Account'],
    summary: 'Create account endpoint',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/createAcountRequest'
          },
          example: {
            name: 'Fulano Ciclano',
            cpf: '12345678910'
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Create account success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/createAccountSuccessResponse'
            },
            example: {
              id: 1,
              name: 'Fulano Ciclano',
              cpf: '12345678910',
              amount: 0,
              createdAt: '2022-07-26T12:46:27.287Z'
            }
          }
        }
      },
      400: {
        description: 'Create account validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/baseErrorResponse'
            },
            example: {
              message: 'Parametros invalidos'
            }
          }
        }
      },
      500: {
        description: 'Create account error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/baseErrorResponse'
            },
            example: {
              message: 'Erro ao criar conta'
            }
          }
        }
      }
    }
  }
}

export const transferPath = {
  post: {
    tags: ['Account'],
    summary: 'Transfer endpoint',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/transferRequest'
          },
          example: {
            originAccountId: 1,
            destinationAccountId: 2,
            amount: 30
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Transfer success'
      },
      400: {
        description: 'Transfer validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/baseErrorResponse'
            },
            example: {
              message: 'Parametros invalidos'
            }
          }
        }
      },
      500: {
        description: 'Transfer error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/baseErrorResponse'
            },
            example: {
              message: 'Erro ao tranferir valor'
            }
          }
        }
      }
    }
  }
}

export const depositPath = {
  post: {
    tags: ['Account'],
    summary: 'Deposit endpoint',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/depositRequest'
          },
          example: {
            accountId: 1,
            amount: 30
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Deposit success'
      },
      400: {
        description: 'Deposit validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/baseErrorResponse'
            },
            example: {
              message: 'Parametros invalidos'
            }
          }
        }
      },
      500: {
        description: 'Deposit error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/baseErrorResponse'
            },
            example: {
              message: 'Erro ao depositar valor'
            }
          }
        }
      }
    }
  }
}

```
2. `index.ts`
```
import { accountPath, depositPath, transferPath } from './bank_account.paths'

const accountPaths = {
  '/accounts': accountPath,
  '/accounts/transfer': transferPath,
  '/accounts/deposit': depositPath
}

export default {
  ...accountPaths
}

```

Dentro da pasta `docs` crie a pasta `schemas` com os seguintes arquivos:

1. `bank_account.schemas.ts`
```
export const createAcountRequest = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    cpf: {
      type: 'string'
    }
  },
  required: ['email', 'cpf']
}

export const createAccountSuccessResponse = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    cpf: {
      type: 'string'
    },
    amount: {
      type: 'number'
    },
    createdAt: {
      type: 'string'
    }
  }
}

export const transferRequest = {
  type: 'object',
  properties: {
    originAccountId: {
      type: 'number'
    },
    destinationAccountId: {
      type: 'number'
    },
    amount: {
      type: 'number'
    }
  },
  required: ['originAccountId', 'destinationAccountId', 'amount']
}

export const depositRequest = {
  type: 'object',
  properties: {
    accountId: {
      type: 'number'
    },
    amount: {
      type: 'number'
    }
  },
  required: ['accountId', 'amount']
}

```
2. `base.schemas.ts`
```
export const baseErrorResponse = {
  type: 'object',
  properties: {
    message: {
      type: 'string'
    }
  }
}

```
3. `index.ts`
```
export * from './base.schemas'
export * from './bank_account.schemas'

```

#### Testes

Dentro da pasta `tests` crie a pasta `routes` e o arquivo `bank_account.routes.spec.ts` com o seguinte conteúdo:

```
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

```