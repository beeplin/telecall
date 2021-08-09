/// <reference lib="dom" />

import 'isomorphic-fetch'
import { UniCallError } from './error'
import type {
  Fn,
  PromiseReturnType,
  UniCallInfo,
  UniCallRequest,
  UniCallResponse,
} from './types'

const JSON_RPC_INVALID_REQUEST = -32600

let callId = 0

export default call

async function call<T extends Fn>(
  fn: T | UniCallInfo,
  ...params: Parameters<T>
): PromiseReturnType<T> {
  if (typeof fn === 'function') return fn(...params)
  nextId()
  const info = fn
  const request: UniCallRequest<T> = {
    jsonrpc: '2.0',
    method: `${info.path}//${info.name}`,
    params,
    id: callId,
  }
  const rawResponse = await fetch(info.endpoint, {
    method: 'POST',
    headers: buildHeadersByPersistedToken(info),
    body: JSON.stringify(request),
  })
  persistTokenFromResponseHeaders(rawResponse.headers, info)
  const response = (await rawResponse.json()) as UniCallResponse<T>
  handleErrors(response, request)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return response.result!
}

function nextId() {
  callId = callId >= Number.MAX_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : callId + 1
}

const memoryStorage: Record<string, string> = {}

function buildHeadersByPersistedToken(info: UniCallInfo) {
  const headers = new Headers({ 'content-type': 'application/json' })
  if (info.persistence === 'localStorage') {
    const tokenName = getTokenName(info)
    const token =
      globalThis.localStorage?.getItem(tokenName) ?? memoryStorage[tokenName] ?? '' // TODO cookie fetch
    headers.set('authorization', token)
  }
  return headers
}

function persistTokenFromResponseHeaders(headers: Headers, info: UniCallInfo) {
  if (info.persistence === 'localStorage') {
    const token = headers.get('authorization')
    if (token != null) {
      const tokenName = getTokenName(info)
      if (globalThis.localStorage) localStorage.setItem(tokenName, token)
      else memoryStorage[tokenName] = token
    }
  }
}

function handleErrors<T extends Fn>(
  response: UniCallResponse<T>,
  request: UniCallRequest<T>,
) {
  if (response.error) throw new UniCallError(response.error)
  if (response.jsonrpc !== '2.0' || response.id !== request.id)
    throw new UniCallError({
      code: JSON_RPC_INVALID_REQUEST,
      message: 'Invalid Request',
    })
}

function getTokenName(info: UniCallInfo) {
  return `sessionToken::${info.endpoint}`
}
