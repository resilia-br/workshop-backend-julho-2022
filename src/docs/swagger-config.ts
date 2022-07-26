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
