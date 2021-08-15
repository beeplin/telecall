/* eslint-disable @typescript-eslint/no-explicit-any */

export type Fn = (...params: any[]) => any

export type UnPromise<T> = T extends Promise<infer U> ? U : T

// export type RestPardms<T> = T extends (first: any, ...rest: infer U) => any ? U : never

export type PromiseReturnType<T extends Fn> = Promise<UnPromise<ReturnType<T>>>

export interface TeleRequest<T extends Fn> {
  jsonrpc: '2.0'
  method: string
  params?: Parameters<T>
  id: number | string
}

export interface TeleResponseError {
  code: number
  message: string
  data?: unknown
}

export interface TeleResponse<T extends Fn> {
  jsonrpc: '2.0'
  result?: UnPromise<ReturnType<T>>
  error?: TeleResponseError
  id: number | string | null
}
