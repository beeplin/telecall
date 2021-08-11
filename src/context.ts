import { AsyncLocalStorage } from 'async_hooks'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ContextStore<C extends Record<string, any>> {
  private als = new AsyncLocalStorage<{ context: C }>()

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  private fakeContext = {} as C

  set(value: C): void {
    const store = this.als.getStore()
    if (store) store.context = value
    else this.fakeContext = value
  }

  get(): C {
    return this.als.getStore()?.context ?? this.fakeContext
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runWith(value: C, fn: (...params: any[]) => any): void {
    this.als.run({ context: value }, fn)
  }
}
