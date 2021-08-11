import type {
  Fn,
  UniCallRequest,
  UniCallResponse,
  UniCallResponseError,
  UnPromise,
} from './types'

const JSON_RPC_PARSE_ERROR = -32700
const JSON_RPC_INVALID_REQUEST = -32600
const JSON_RPC_METHOD_NOT_FOUND = -32601

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
  api: Record<string, T>,
): Promise<UniCallResponse<T>> {
  const [fn, errorValue] = getFn<T>(request, api)
  if (errorValue) return errorValue
  const { jsonrpc, params, id } = request
  try {
    // @ts-expect-error 2721 2488
    const result = (await fn(...params)) as UnPromise<ReturnType<T>>
    return { jsonrpc, id, result }
  } catch (error: unknown) {
    const {
      code = 0,
      message = 'Unknown error',
      data = JSON.stringify(error),
    } = error as UniCallResponseError
    return { jsonrpc, id, error: { code, message, data } }
  }
}

function getFn<T extends Fn>(
  request: UniCallRequest<T> | null,
  api: Record<string, T>,
): [null, UniCallResponse<T>] | [T, null] {
  if (!request) return [null, parseError()]
  const { jsonrpc, method, id } = request
  const isInvalid = jsonrpc !== '2.0' || typeof method !== 'string' || id === undefined
  if (isInvalid) return [null, invalidRequest()]
  const fn = api[method] as T
  if (!fn) return [null, methodNotFound(request)]
  return [fn, null]
}

function parseError() {
  return {
    jsonrpc: '2.0' as const,
    error: { code: JSON_RPC_PARSE_ERROR, message: 'Parse error' },
    id: null,
  }
}

function invalidRequest() {
  return {
    jsonrpc: '2.0' as const,
    error: { code: JSON_RPC_INVALID_REQUEST, message: 'Invalid Request' },
    id: null,
  }
}

function methodNotFound<T extends Fn>({ jsonrpc, method, id }: UniCallRequest<T>) {
  return {
    jsonrpc,
    error: {
      code: JSON_RPC_METHOD_NOT_FOUND,
      message: 'Method not found',
      data: { method },
    },
    id,
  }
}
