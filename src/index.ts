import 'dotenv/config'
import './database/config'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import apiRouter from './routes/index'

const app = express()
const port = process.env.PORT ?? 3001

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())

// Routes
app.use('/api/v1', apiRouter)

// Say hello
app.get('/', (_req, res) =>
  res.status(200).json({ message: 'Bienvenido al core de 100 citas!' })
)

// Local environment
if (process.env.ENV === 'local') {
  app.listen(port, () => {
    console.log(`Servidor escuchando en :${port}`)
  })
}
