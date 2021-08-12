import cors from 'cors'
import express from 'express'
import tele from '../../../dist/express'
import { ExpressSession } from '../../../dist/session'
import * as api from './api'
import context from './context'

const NAME = 'server1'
const PORT = 4100

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
