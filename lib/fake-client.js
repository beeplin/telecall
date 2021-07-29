'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.FakeClient = void 0
class FakeClient {
  constructor(ctx) {
    this.ctx = ctx
  }
  reset() {}
  async call(fn, ...params) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fn(this.ctx, ...params)
  }
}
exports.FakeClient = FakeClient
//# sourceMappingURL=fake-client.js.map
