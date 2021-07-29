import type { Client, Fn, PromiseReturnType, RestParams } from './types'

export class FakeClient implements Client {
  constructor(private readonly ctx: unknown) {}

  reset(): void {}

  async call<T extends Fn>(fn: T, ...params: RestParams<T>): PromiseReturnType<T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fn(this.ctx, ...params)
  }
}
