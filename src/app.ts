import express from 'express'

import initRoutes from './routes'

const app = express()

app.use(express.json())
initRoutes(app)

export { app }
