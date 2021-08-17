import { AsyncLocalStorage } from 'async_hooks'
import type { Fn } from './types'

export class ContextStore<C> {
  private als = new AsyncLocalStorage<{ context: C }>()

  private fakeContext: C | null = null

  set(value: C): void {
    const store = this.als.getStore()
    if (store) store.context = value
    else this.fakeContext = value
  }

  get(): C {
    const context = this.als.getStore()?.context
    if (context) return context
    if (this.fakeContext) return this.fakeContext
    throw new Error('context not been set')
  }

  runWith(value: C, fn: Fn): void {
    this.als.run({ context: value }, fn)
  }
}
