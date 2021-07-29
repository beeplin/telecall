import type { Fn, TeleResponse } from './types'

export class TeleError<T extends Fn> extends Error {
  code: number

  data: unknown

  constructor(error: Required<TeleResponse<T>>['error']) {
    super()
    this.name = 'TeleError'
    this.code = error.code
    this.message = error.message
    this.data = error.data
  }
}
