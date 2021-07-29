import type { Client, Fn, PromiseReturnType, RestParams } from './types'
export declare class FakeClient implements Client {
  private readonly ctx
  constructor(ctx: unknown)
  reset(): void
  call<T extends Fn>(fn: T, ...params: RestParams<T>): PromiseReturnType<T>
}
//# sourceMappingURL=fake-client.d.ts.map
