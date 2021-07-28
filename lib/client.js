'use strict'
/* eslint-disable  */
/// <reference lib="dom" />
Object.defineProperty(exports, '__esModule', { value: true })
exports.TeleClient = exports.FakeClient = void 0
class FakeClient {
  constructor(ctx) {
    this.ctx = ctx
  }
  reset() {}
  async call(fn, ...params) {
    return fn(this.ctx, ...params)
  }
}
exports.FakeClient = FakeClient
/* eslint-enable */
class TeleError extends Error {
  constructor(error) {
    super()
    this.name = 'TeleError'
    this.code = error.code
    this.message = error.message
    this.data = error.data
  }
}
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
    // eslint-disable-next-line
    this.fetch = fetch === (window && window.fetch) ? fetch.bind(window) : fetch
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
    if (error) throw new TeleError(error)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (jsonrpc !== '2.0' || id !== request.id)
      throw new TeleError({
        code: JSON_RPC_INVALID_REQUEST,
        message: 'Invalid Request',
      })
    // eslint-disable-next-line
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
