import { AsyncLocalStorage } from 'async_hooks'

export class Context<T> {
  private als = new AsyncLocalStorage<{ context: T }>()

  private test: T | undefined

  set(value: T): void {
    const store = this.als.getStore()
    if (store) store.context = value
    else this.test = value
  }

  get(): T {
    return this.test ?? (this.als.getStore()?.context as T)
  }

  run(value: T, fn: (...params: any[]) => void): void {
    this.als.run({ context: value }, fn)
  }
}
