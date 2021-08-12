import cors from 'cors'
import express from 'express'
import tele from '../../../dist/express'
import * as api from './api'
import context, { ExpressSession } from './context'

const NAME = 'server0'
const PORT = 4000

express()
  .use(cors({ origin: true, credentials: true }))
  .post(
    '/api',
    express.json(),
    tele(api, context, (req, res) => ({
      server: NAME,
      session: new ExpressSession(req, res),
    })),
  )
  .use(express.static('./public'))
  .listen(PORT, () => {
    console.info(`${NAME} started on port ${PORT}`)
  })
