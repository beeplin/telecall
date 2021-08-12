/* eslint-disable import/no-namespace */
import cors from 'cors'
import express from 'express'
import tele from '../../../dist/express'
import * as api from './api'
import context from './context'

const NAME = 'server2'
const PORT = 4200

express()
  .use(cors())
  .use(express.json())
  .post(
    '/api',
    tele(api, context, () => ({ server: NAME })),
  )
  .use(express.static('./public'))
  .listen(PORT, () => {
    console.info(`${NAME} started on port ${PORT}`)
  })
