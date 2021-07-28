/// <reference lib="dom" />
import { Client, Fn, PromiseReturnType, RestParams } from './types'
export declare class FakeClient implements Client {
  private readonly ctx
  constructor(ctx: unknown)
  reset(): void
  call<T extends Fn>(fn: T, ...params: RestParams<T>): PromiseReturnType<T>
}
export declare class TeleClient implements Client {
  readonly endpoint: string
  readonly tokenPersistence: typeof window.localStorage | 'cookie'
  readonly localStorageName: string
  readonly getMethodName: (fn: { name: string; path: string }) => string
  fetch: typeof window.fetch
  headers: Headers
  id: number
  constructor(
    fetch: typeof window.fetch,
    endpoint: string,
    tokenPersistence?: typeof window.localStorage | 'cookie',
    localStorageName?: string,
    getMethodName?: (fn: { name: string; path: string }) => string,
  )
  call<T extends Fn>(fn: T, ...params: RestParams<T>): PromiseReturnType<T>
  reset(): void
  private addTokenToRequest
  private persistTokenFromResponse
  private nextId
}
//# sourceMappingURL=client.d.ts.map
