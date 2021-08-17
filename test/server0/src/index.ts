import cors from 'cors'
import express from 'express'
import path from 'path'
import { ExpressCookieSession, ExpressHeaderSession, telecall } from '../../../dist'
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
    telecall(api, context, (req, res) => ({
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
