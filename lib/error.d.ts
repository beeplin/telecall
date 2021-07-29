import type { Fn, TeleResponse } from './types'
export declare class TeleError<T extends Fn> extends Error {
  code: number
  data: unknown
  constructor(error: Required<TeleResponse<T>>['error'])
}
//# sourceMappingURL=error.d.ts.map
