import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { getConfig } from './utils'

export interface Context {
  req: Request
  res: Response
}

type Headers = Record<string, string>

interface Options {
  extraHeaders?: Headers
  convertResolverPath?: (input: string) => string
}

const { resolverRootDir, requestEndpoint } = getConfig()
const { port, pathname: requestBasePath } = requestEndpoint
const defaultHeaders: Headers = { 'Content-Type': 'application/json' }

export default {
  port: Number(port),
  path: requestBasePath,
  middleware({ extraHeaders = {}, convertResolverPath = (s) => s }: Options = {}) {
    const headers = { ...defaultHeaders, ...extraHeaders }
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body) {
        next(new Error(`'app.use(express.json())' is missing.`))
        return
      }
      const location = path.join(resolverRootDir, convertResolverPath(req.path))
      const func = await import(location).then((m) => m.default)
      const result = await func({ req, res }, ...req.body)
      res.set(headers).status(200).json(result)
    }
  },
}
