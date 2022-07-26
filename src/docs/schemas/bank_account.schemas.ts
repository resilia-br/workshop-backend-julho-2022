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
