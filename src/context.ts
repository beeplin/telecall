import { AsyncLocalStorage } from 'async_hooks'

export class Context<T> {
  private als = new AsyncLocalStorage<{ context: T }>()

  private fake: T | undefined

  set(value: T): void {
    const store = this.als.getStore()
    if (store) store.context = value
    else this.fake = value
  }

  get(): T {
    return this.als.getStore()?.context ?? (this.fake as T)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run(value: T, fn: (...params: any[]) => any): void {
    this.als.run({ context: value }, fn)
  }
}
