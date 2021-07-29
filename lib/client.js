'use strict'
/// <reference lib="dom" />
Object.defineProperty(exports, '__esModule', { value: true })
exports.TeleClient = void 0
const error_1 = require('./error')
const JSON_RPC_INVALID_REQUEST = -32600
class TeleClient {
  // eslint-disable-next-line max-params
  constructor(
    fetch,
    endpoint,
    tokenPersistence = 'cookie',
    localStorageName = 'sessionToken',
    getMethodName = (fn) => `${fn.path}//${fn.name}`,
  ) {
    this.endpoint = endpoint
    this.tokenPersistence = tokenPersistence
    this.localStorageName = localStorageName
    this.getMethodName = getMethodName
    this.headers = new Headers({ 'content-type': 'application/json' })
    this.id = 0
    this.fetch = fetch === globalThis.fetch ? fetch.bind(globalThis) : fetch
  }
  async call(fn, ...params) {
    this.nextId()
    this.addTokenToRequest()
    const request = {
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
    const { jsonrpc, result, error, id } = await response.json()
    if (error) throw new error_1.TeleError(error)
    if (jsonrpc !== '2.0' || id !== request.id || result === undefined)
      throw new error_1.TeleError({
        code: JSON_RPC_INVALID_REQUEST,
        message: 'Invalid Request',
      })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result
  }
  reset() {
    if (this.tokenPersistence === 'cookie') return
    this.tokenPersistence.removeItem(this.localStorageName)
  }
  addTokenToRequest() {
    if (this.tokenPersistence === 'cookie') return
    const token = this.tokenPersistence.getItem(this.localStorageName) ?? ''
    this.headers.set('authorization', token)
  }
  persistTokenFromResponse(response) {
    if (this.tokenPersistence === 'cookie') return
    const token = response.headers.get('authorization')
    if (token != null) this.tokenPersistence.setItem(this.localStorageName, token)
  }
  nextId() {
    this.id = this.id >= Number.MAX_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : this.id + 1
  }
}
exports.TeleClient = TeleClient
//# sourceMappingURL=client.js.map
