import { ContextStore } from '../context'

const context = new ContextStore<{ value: number }>()

describe('context', () => {
  it('makes different contexts in ctx.run()', async () => {
    const res = await Promise.all(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i) => {
        return new Promise<number>((resolve) => {
          context.runWith({ value: i }, () => {
            context.set({ value: i + 10 })
            setTimeout(() => {
              resolve(context.get().value)
            }, Math.random() * 1000)
          })
        })
      }),
    )

    expect(res).toStrictEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 10])
  })

  it('makes shared context out of ctx.run()', async () => {
    const res = await Promise.all(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i) => {
        return new Promise<number>((resolve) => {
          context.set({ value: i + 10 })
          setTimeout(() => {
            resolve(context.get().value)
          }, Math.random() * 1000)
        })
      }),
    )

    expect(res).toStrictEqual([10, 10, 10, 10, 10, 10, 10, 10, 10, 10])
  })
})
