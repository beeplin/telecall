/* eslint-disable @typescript-eslint/no-explicit-any */

export type Fn = (...params: any[]) => any

export type UnPromise<T> = T extends Promise<infer U> ? U : T

export type RestParams<T> = T extends (first: any, ...rest: infer U) => any ? U : never

export type PromiseReturnType<T extends Fn> = Promise<UnPromise<ReturnType<T>>>

export interface Client {
  call: <T extends Fn>(fn: T, ...params: RestParams<T>) => PromiseReturnType<T>
}

export interface UniCallInfo {
  endpoint: string
  method: string
  persistence?: 'cookie' | 'localStorage'
}

export interface UniCallRequest<T extends Fn> {
  jsonrpc: '2.0'
  method: string
  params?: Parameters<T>
  id: number | string
}

export interface UniCallResponseError {
  code: number
  message: string
  data?: unknown
}

export interface UniCallResponse<T extends Fn> {
  jsonrpc: '2.0'
  result?: UnPromise<ReturnType<T>>
  error?: UniCallResponseError
  id: number | string | null
}
