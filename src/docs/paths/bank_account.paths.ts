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
