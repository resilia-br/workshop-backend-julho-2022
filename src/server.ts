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
