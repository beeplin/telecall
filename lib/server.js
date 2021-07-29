'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.handleTeleRequest = void 0
const path_1 = require('path')
const HTTP_OK = 200
const HTTP_BAD_REQUEST = 400
const HTTP_NOT_FOUND = 404
const JSON_RPC_PARSE_ERROR = -32700
const JSON_RPC_INVALID_REQUEST = -32600
const JSON_RPC_METHOD_NOT_FOUND = -32601
async function handleTeleRequest(request, ctx) {
  const [fn, errorValue] = getFn(request)
  if (errorValue) return errorValue
  const { jsonrpc, params, id } = request
  try {
    // @ts-expect-error 2721 2488
    const result = await fn(ctx, ...params)
    return { status: HTTP_OK, json: { jsonrpc, id, result } }
  } catch (error) {
    const { code = 0, message = 'Unknown error', data = JSON.stringify(error) } = error
    return {
      status: HTTP_BAD_REQUEST,
      json: { jsonrpc, id, error: { code, message, data } },
    }
  }
}
exports.handleTeleRequest = handleTeleRequest
function getFn(request) {
  if (!request) return [null, parseError()]
  const { jsonrpc, method, id } = request
  if (jsonrpc !== '2.0' || typeof method !== 'string' || id === undefined)
    return [null, invalidRequest()]
  const [path, name = 'default'] = method.split('//')
  const location = path_1.join(process.cwd(), path)
  try {
    // eslint-disable-next-line
    const fn = require(location)[name]
    return [fn, null]
  } catch (error) {
    return [null, methodNotFound(request)]
  }
}
function parseError() {
  return {
    status: HTTP_BAD_REQUEST,
    json: {
      jsonrpc: '2.0',
      error: { code: JSON_RPC_PARSE_ERROR, message: 'Parse error' },
      id: null,
    },
  }
}
function invalidRequest() {
  return {
    status: HTTP_BAD_REQUEST,
    json: {
      jsonrpc: '2.0',
      error: { code: JSON_RPC_INVALID_REQUEST, message: 'Invalid Request' },
      id: null,
    },
  }
}
function methodNotFound({ jsonrpc, method, id }) {
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
//# sourceMappingURL=server.js.map
