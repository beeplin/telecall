import cors from 'cors'
import express from 'express'
import { handleTeleRequest } from '../../../src'

const app = express()

app.use(cors())
app.use(express.json())

app.post('/telecall', (req, res) => {
  const ctx = { userId: 1001 }
  handleTeleRequest(req.body, ctx)
    .then(({ status, json }) => {
      console.log(json)
      res.status(status).json(json)
    })
    .catch((error) => {
      res.status(500).json(error.toString())
    })
})

app.use(express.static('./public'))

app.listen(3300, () => {
  console.log('started on port 3300')
})
