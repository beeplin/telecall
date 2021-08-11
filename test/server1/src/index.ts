/* eslint-disable import/no-namespace */
import cors from 'cors'
import express from 'express'
import tele from '../../../dist/tele'
import * as api from './api'
import context from './context'

const NAME = 'server1'
const PORT = 4100

express()
  .use(cors())
  .use(express.json())
  .post(
    '/api',
    tele(api, context, () => ({ server: NAME })),
  )
  .listen(PORT, () => {
    console.info(`${NAME} started on port ${PORT}`)
  })
