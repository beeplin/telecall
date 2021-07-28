/* eslint-disable  */

export type Fn = (...params: any[]) => any

export type UnPromise<T> = T extends Promise<infer U> ? U : T

export type RestParams<T> = T extends (first: any, ...rest: infer U) => any ? U : never

export type PromiseReturnType<T extends Fn> = Promise<UnPromise<ReturnType<T>>>

export interface Client {
  call: <T extends Fn>(fn: T, ...params: RestParams<T>) => PromiseReturnType<T>
}

export interface TeleRequest<T extends Fn> {
  jsonrpc: '2.0'
  method: string
  params?: RestParams<T>
  id: number | string
}

export interface TeleResponse<T extends Fn> {
  jsonrpc: '2.0'
  result?: UnPromise<ReturnType<T>>
  error?: {
    code: number
    message: string
    data?: unknown
  }
  id: number | string | null
}
