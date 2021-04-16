import { Application, NextFunction, Request, Response } from 'express'
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

const { resolverBasePath, requestEndpoint } = getConfig()
const { port, pathname: requestBasePath } = requestEndpoint
const requestBasePathLength = requestBasePath.length

export default function (app: Application, options: Options = {}) {
  app.set('port', port)
  const { extraHeaders = {}, convertResolverPath = (s) => s } = options
  const headers = { 'Content-Type': 'application/json', ...extraHeaders }

  return async function (req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'POST' || !req.path.startsWith(requestBasePath)) {
      next()
      return
    }
    if (!req.body) {
      next(new Error(`'app.use(express.json())' is missing.`))
      return
    }

    const relativePath = req.path.substr(requestBasePathLength)
    const location = path.resolve(resolverBasePath, convertResolverPath(relativePath))
    const func = await import(location).then((m) => m.default)
    const context: Context = { req, res }
    const result = await func(context, ...req.body)
    res.set(headers).status(200).json(result).end()

    return
  }
}
