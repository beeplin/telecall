import type {
  Fn,
  UniCallRequest,
  UniCallResponse,
  UniCallResponseError,
  UnPromise,
} from './types'

const HTTP_OK = 200
const HTTP_BAD_REQUEST = 400
const HTTP_NOT_FOUND = 404

const JSON_RPC_PARSE_ERROR = -32700
const JSON_RPC_INVALID_REQUEST = -32600
const JSON_RPC_METHOD_NOT_FOUND = -32601

interface ReturnValue<T extends Fn> {
  status: number
  json: UniCallResponse<T>
}

// export function uniCallExpressMiddleware(context: unknown) {
//   return (req, res) => {
//     runWithContext(context, () => {
//       handleUniCall(req.body as UniCallRequest<Fn>)
//         .then(({ status, json }) => res.status(status).json(json))
//         .catch((error) => res.status(ERROR).json(error))
//     })
//   }
// }

export async function handleUniCall<T extends Fn>(
  request: UniCallRequest<T>,
  root: string,
): Promise<{ status: number; json: UniCallResponse<T> }> {
  const [fn, errorValue] = getFn<T>(request, root)
  if (errorValue) return errorValue
  const { jsonrpc, params, id } = request
  try {
    // @ts-expect-error 2721 2488
    const result = (await fn(...params)) as UnPromise<ReturnType<T>>
    return { status: HTTP_OK, json: { jsonrpc, id, result } }
  } catch (error: unknown) {
    const {
      code = 0,
      message = 'Unknown error',
      data = JSON.stringify(error),
    } = error as UniCallResponseError
    return {
      status: HTTP_BAD_REQUEST,
      json: { jsonrpc, id, error: { code, message, data } },
    }
  }
}

function getFn<T extends Fn>(
  request: UniCallRequest<T> | null,
  root: string,
): [null, ReturnValue<T>] | [T, null] {
  if (!request) return [null, parseError()]
  const { jsonrpc, method, id } = request
  if (jsonrpc !== '2.0' || typeof method !== 'string' || id === undefined)
    return [null, invalidRequest()]
  const [path, name = 'default'] = method.split('//')
  try {
    // eslint-disable-next-line
    const fn = require(require('path').join(root, path))[name] as T
    return [fn, null]
  } catch (error: unknown) {
    return [null, methodNotFound(request)]
  }
}

function parseError() {
  return {
    status: HTTP_BAD_REQUEST,
    json: {
      jsonrpc: '2.0' as const,
      error: { code: JSON_RPC_PARSE_ERROR, message: 'Parse error' },
      id: null,
    },
  }
}

function invalidRequest() {
  return {
    status: HTTP_BAD_REQUEST,
    json: {
      jsonrpc: '2.0' as const,
      error: { code: JSON_RPC_INVALID_REQUEST, message: 'Invalid Request' },
      id: null,
    },
  }
}

function methodNotFound<T extends Fn>({ jsonrpc, method, id }: UniCallRequest<T>) {
  return {
    status: HTTP_NOT_FOUND,
    json: {
      jsonrpc,
      error: {
        code: JSON_RPC_METHOD_NOT_FOUND,
        message: 'Method not found',
        data: { method },
      },
      id,
    },
  }
}
