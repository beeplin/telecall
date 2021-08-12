import type express from 'express'
import type { ContextStore } from './context'
import execute from './execute'
import type { Fn, TeleRequest } from './types'

const HTTP_OK = 200
const HTTP_BAD_REQUEST = 400
const HTTP_INTERNAL_SERVER_ERROR = 500

export default function tele<T extends Record<string, unknown>>(
  api: Record<string, Fn>,
  context: ContextStore<T>,
  getInitialContext: (req: express.Request, res: express.Response) => T,
): (req: express.Request, res: express.Response) => void {
  return (req, res) => {
    context.runWith(getInitialContext(req, res), () => {
      res.setHeader('access-control-expose-headers', 'authorization')
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
  }
}
