import cors from 'cors'
import express from 'express'
import { handleTeleRequest } from '../../../src/server'
import type { Fn, TeleRequest } from '../../../src/types'

const PORT = 3300
const ERROR = 500

const app = express()

app.use(cors())
app.use(express.json())

app.post('/telecall', (req, res) => {
  const ctx = { userId: 1000 }
  handleTeleRequest(req.body as TeleRequest<Fn>, ctx)
    .then(({ status, json }) => {
      console.info(json)
      res.status(status).json(json)
    })
    .catch((error) => {
      res.status(ERROR).json(error)
    })
})

app.use(express.static('./public'))

app.listen(PORT, () => {
  console.info('started on port 3300')
})
