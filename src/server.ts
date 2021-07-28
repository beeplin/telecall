import type { Fn, TeleRequest, TeleResponse, UnPromise } from './types'

const HTTP_OK = 200
const HTTP_BAD_REQUEST = 400
const HTTP_NOT_FOUND = 404

const JSON_RPC_PARSE_ERROR = -32700
const JSON_RPC_INVALID_REQUEST = -32600
const JSON_RPC_METHOD_NOT_FOUND = -32601

interface ReturnValue<T extends Fn> {
  status: number
  json: TeleResponse<T>
}

export async function handleTeleRequest<T extends Fn>(
  request: TeleRequest<T>,
  ctx: unknown,
): Promise<{ status: number; json: TeleResponse<T> }> {
  const [fn, errorValue] = getFn<T>(request)
  if (errorValue) return errorValue
  const { jsonrpc, params, id } = request
  try {
    // @ts-expect-error 2721 2488
    const result = (await fn(ctx, ...params)) as UnPromise<ReturnType<T>>
    return { status: HTTP_OK, json: { jsonrpc, id, result } }
  } catch (error: unknown) {
    // @ts-expect-error 2339
    const { code = 0, message = 'Unknown error', data = JSON.stringify(error) } = error
    return {
      status: HTTP_BAD_REQUEST,
      // eslint-disable-next-line
      json: { jsonrpc, id, error: { code, message, data } },
    }
  }
}

function getFn<T extends Fn>(
  request: TeleRequest<T> | null,
): [null, ReturnValue<T>] | [T, null] {
  if (!request) return [null, parseError()]
  const { jsonrpc, method, id } = request
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (jsonrpc !== '2.0' || typeof method !== 'string' || id === undefined)
    return [null, invalidRequest()]
  const [path, name = 'default'] = method.split('//')
  // eslint-disable-next-line
  const location: string = require('path').join(process.cwd(), path)
  try {
    // eslint-disable-next-line
    const fn = require(location)[name] as T
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

function methodNotFound<T extends Fn>({ jsonrpc, method, id }: TeleRequest<T>) {
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
