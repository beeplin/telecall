import cors from 'cors'
import express from 'express'
import path from 'path'
import '../../../dist'
import tele from '../../../dist/express'
import { ExpressCookieSession, ExpressHeaderSession } from '../../../dist/session'
import * as api from './api'
import context from './context'

const NAME = process.env.NAME ?? 'server0'
const DEFAULT_PORT = 4000
const PORT = process.env.PORT ?? DEFAULT_PORT
const SESSION = process.env.SESSION ?? 'header'

express()
  .use(cors({ origin: true, credentials: true }))
  .post(
    '/api',
    express.json(),
    tele(api, context, (req, res) => ({
      server: NAME,
      session:
        SESSION === 'cookie'
          ? new ExpressCookieSession(req, res, `sessionToken::${NAME}`)
          : new ExpressHeaderSession(req, res),
    })),
  )
  .use(express.static(path.join(__dirname, '../public')))
  .listen(PORT, () => {
    console.info(`${NAME} started on port ${PORT} with sessin token in ${SESSION}`)
  })
