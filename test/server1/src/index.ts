/* eslint-disable import/no-namespace */
import cors from 'cors'
import express from 'express'
import { execute } from '../../../dist/server'
import type { Fn, TeleRequest } from '../../../dist/types'
import * as api from './api'
import context from './context'

const NAME = 'server1'
const PORT = 4100

const HTTP_OK = 200
const HTTP_BAD_REQUEST = 400
const HTTP_INTERNAL_SERVER_ERROR = 500

const app = express()

app.use(cors())
app.use(express.json())

app.post('/api', (req, res) => {
  context.runWith({ server: NAME }, () => {
    execute(req.body as TeleRequest<Fn>, api)
      .then((json) => {
        console.info(json)
        res.status(json.error ? HTTP_BAD_REQUEST : HTTP_OK).json(json)
      })
      .catch((error) => {
        console.error(error)
        res.status(HTTP_INTERNAL_SERVER_ERROR).json(error)
      })
  })
})

app.use(express.static('./public'))

app.listen(PORT, () => {
  console.info(`${NAME} started on port ${PORT}`)
})
