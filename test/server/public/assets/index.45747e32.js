var e = { path: 'src/module1.tele.ts', name: 'default' }
class t extends Error {
  constructor(e) {
    super(),
      (this.name = 'TeleError'),
      (this.code = e.code),
      (this.message = e.message),
      (this.data = e.data)
  }
}
const s = new (class {
  constructor(
    e,
    t,
    s = 'cookie',
    o = 'sessionToken',
    n = (e) => `${e.path}//${e.name}`,
  ) {
    ;(this.endpoint = t),
      (this.tokenPersistence = s),
      (this.localStorageName = o),
      (this.getMethodName = n),
      (this.headers = new Headers({ 'content-type': 'application/json' })),
      (this.id = 0),
      (this.fetch = e === (window && window.fetch) ? e.bind(window) : e)
  }
  async call(e, ...s) {
    this.nextId(), this.addTokenToRequest()
    const o = { jsonrpc: '2.0', method: this.getMethodName(e), params: s, id: this.id },
      n = await this.fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(o),
      })
    this.persistTokenFromResponse(n)
    const { jsonrpc: i, result: a, error: r, id: h } = await n.json()
    if (r) throw new t(r)
    if ('2.0' !== i || h !== o.id)
      throw new t({ code: -32600, message: 'Invalid Request' })
    return a
  }
  reset() {
    'cookie' !== this.tokenPersistence &&
      this.tokenPersistence.removeItem(this.localStorageName)
  }
  addTokenToRequest() {
    var e
    if ('cookie' === this.tokenPersistence) return
    const t =
      null != (e = this.tokenPersistence.getItem(this.localStorageName)) ? e : ''
    this.headers.set('authorization', t)
  }
  persistTokenFromResponse(e) {
    if ('cookie' === this.tokenPersistence) return
    const t = e.headers.get('authorization')
    null != t && this.tokenPersistence.setItem(this.localStorageName, t)
  }
  nextId() {
    this.id = this.id >= Number.MAX_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : this.id + 1
  }
})(fetch, 'http://localhost:3300/telecall', localStorage)
const o = document.getElementById('app')
o &&
  Promise.all([
    s.call(e, 'mod1_input'),
    s.call({ path: 'src/module1.tele.ts', name: 'fn1' }),
    s.call({ path: 'src/folder/module2.tele.ts', name: 'default' }, 1),
    s.call({ path: 'src/folder/module2.tele.ts', name: 'fn1' }),
    (async function () {
      return await s.call(e, 'from m3')
    })(),
  ])
    .then((e) => {
      o.innerHTML = `<pre>${JSON.stringify(e, null, 4)}</pre>`
    })
    .catch((e) => {
      o.innerHTML = e
    })
