import type { Fn, UniCallResponse } from './types'

export class UniCallError<T extends Fn> extends Error {
  code: number

  data: unknown

  constructor(error: Required<UniCallResponse<T>>['error']) {
    super()
    this.name = 'TeleError'
    this.code = error.code
    this.message = error.message
    this.data = error.data
  }
}
