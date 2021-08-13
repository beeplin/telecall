import cors from 'cors'
import express from 'express'
import path from 'path'
import tele from '../../../dist/express'
import { ExpressCookieSession } from '../../../dist/session'
import * as api from './api'
import context from './context'

const NAME = 'server0'
const PORT = 4000

express()
  .use(cors({ origin: true, credentials: true }))
  .post(
    '/api',
    express.json(),
    tele(api, context, (req, res) => ({
      server: NAME,
      session: new ExpressCookieSession(req, res, `sessionToken::${NAME}`),
    })),
  )
  .use(express.static(path.join(__dirname, '../public')))
  .listen(PORT, () => {
    console.info(`${NAME} started on port ${PORT}`)
  })
