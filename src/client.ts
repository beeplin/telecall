/// <reference lib="dom" />

import { TeleError } from './error'
import type {
  Client,
  Fn,
  PromiseReturnType,
  RestParams,
  TeleRequest,
  TeleResponse,
} from './types'

const JSON_RPC_INVALID_REQUEST = -32600

export class TeleClient implements Client {
  fetch: typeof window.fetch

  headers: Headers = new Headers({ 'content-type': 'application/json' })

  id = 0

  // eslint-disable-next-line max-params
  constructor(
    fetch: typeof window.fetch,
    readonly endpoint: string,
    readonly tokenPersistence: typeof window.localStorage | 'cookie' = 'cookie',
    readonly localStorageName: string = 'sessionToken',
    readonly getMethodName = (fn: { name: string; path: string }) =>
      `${fn.path}//${fn.name}`,
  ) {
    this.fetch = fetch === globalThis.fetch ? fetch.bind(globalThis) : fetch
  }

  async call<T extends Fn>(fn: T, ...params: RestParams<T>): PromiseReturnType<T> {
    this.nextId()
    this.addTokenToRequest()
    const request: TeleRequest<T> = {
      jsonrpc: '2.0',
      // @ts-expect-error 2345
      method: this.getMethodName(fn),
      params,
      id: this.id,
    }
    const response = await this.fetch(this.endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(request),
    })
    this.persistTokenFromResponse(response)
    const { jsonrpc, result, error, id } = (await response.json()) as TeleResponse<T>
    if (error) throw new TeleError(error)
    if (jsonrpc !== '2.0' || id !== request.id || result === undefined)
      throw new TeleError({
        code: JSON_RPC_INVALID_REQUEST,
        message: 'Invalid Request',
      })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result
  }

  reset(): void {
    if (this.tokenPersistence === 'cookie') return
    this.tokenPersistence.removeItem(this.localStorageName)
  }

  private addTokenToRequest() {
    if (this.tokenPersistence === 'cookie') return
    const token = this.tokenPersistence.getItem(this.localStorageName) ?? ''
    this.headers.set('authorization', token)
  }

  private persistTokenFromResponse(response: Response) {
    if (this.tokenPersistence === 'cookie') return
    const token = response.headers.get('authorization')
    if (token != null) this.tokenPersistence.setItem(this.localStorageName, token)
  }

  private nextId() {
    this.id = this.id >= Number.MAX_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : this.id + 1
  }
}
