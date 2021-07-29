'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.TeleError = void 0
class TeleError extends Error {
  constructor(error) {
    super()
    this.name = 'TeleError'
    this.code = error.code
    this.message = error.message
    this.data = error.data
  }
}
exports.TeleError = TeleError
//# sourceMappingURL=error.js.map
