/// <reference lib="dom" />

import 'isomorphic-fetch-with-cookie'
import { TeleError } from './error'
import type { Fn, PromiseReturnType, TeleRequest, TeleResponse } from './types'

const JSON_RPC_INVALID_REQUEST = -32600

let callId = 0

export default telecall

// @ts-expect-error 2339
globalThis.__telecall__ = telecall

function telecall(endpoint: string, method: string) {
  return async <T extends Fn>(...params: Parameters<T>): PromiseReturnType<T> => {
    nextId()
    const request: TeleRequest<T> = {
      jsonrpc: '2.0',
      method,
      params,
      id: callId,
    }
    const rawResponse = await fetch(endpoint, {
      method: 'POST',
      headers: buildHeadersByPersistedToken(endpoint),
      body: JSON.stringify(request),
      credentials: 'include',
    })
    persistTokenFromResponseHeaders(rawResponse.headers, endpoint)
    const response = (await rawResponse.json()) as TeleResponse<T>
    handleErrors(response, request)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return response.result!
  }
}

function nextId() {
  callId = callId >= Number.MAX_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : callId + 1
}

let tokenIsInHeader = false
const memoryStorage: Record<string, string> = {}

function buildHeadersByPersistedToken(endpoint: string) {
  const headers = new Headers({ 'content-type': 'application/json' })
  if (tokenIsInHeader) {
    const tokenName = getTokenName(endpoint)
    const token =
      globalThis.localStorage?.getItem(tokenName) ?? memoryStorage[tokenName] ?? ''
    headers.set('authorization', token)
  }
  return headers
}

function persistTokenFromResponseHeaders(headers: Headers, endpoint: string) {
  const token = headers.get('authorization')
  if (token == null) return
  tokenIsInHeader = true
  const tokenName = getTokenName(endpoint)
  if (globalThis.localStorage) localStorage.setItem(tokenName, token)
  else memoryStorage[tokenName] = token
}

function handleErrors<T extends Fn>(
  response: TeleResponse<T>,
  request: TeleRequest<T>,
) {
  if (response.error) throw new TeleError(response.error)
  if (response.jsonrpc !== '2.0' || response.id !== request.id)
    throw new TeleError({
      code: JSON_RPC_INVALID_REQUEST,
      message: 'Invalid Request',
    })
}

function getTokenName(endpoint: string) {
  return `sessionToken::${endpoint}`
}
