import cors from 'cors'
import express from 'express'
import { handleUniCall } from '../../../dist/server'
import type { Fn, UniCallRequest } from '../../../dist/types'
import { runWithContext } from './context'

const NAME = 'server'
const PORT = 4000
const ERROR = 500

const app = express()

app.use(cors())
app.use(express.json())

app.post('/api', (req, res) => {
  runWithContext({ server: NAME }, () => {
    handleUniCall(req.body as UniCallRequest<Fn>, __dirname)
      .then(({ status, json }) => {
        console.info(json)
        res.status(status).json(json)
      })
      .catch((error) => {
        console.error(error)
        res.status(ERROR).json(error)
      })
  })
})

app.use(express.static('./public'))

app.listen(PORT, () => {
  console.info(`${NAME} started on port ${PORT}`)
})
