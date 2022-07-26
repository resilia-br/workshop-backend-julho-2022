import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'

import { swaggerConfig } from '../docs/swagger-config'
import accountRoutes from './bank_account.routes'

export default (app: Express): void => {
  app.use('/api/accounts', accountRoutes)

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig))
}
