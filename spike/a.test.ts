import { Context } from './index'

const ctx = new Context<{ value: number }>()

// ctx.setTest(123)

describe('name of the group', () => {
  it('should 1', async () => {
    const res = await Promise.all(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i) => {
        return new Promise<number>((resolve) => {
          ctx.run({ value: i }, () => {
            ctx.set({ value: i + 10 })
            setTimeout(() => {
              resolve(ctx.get().value)
            }, Math.random() * 1000)
          })
        })
      }),
    )

    expect(res).toStrictEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 10])
  })

  it('should 2', async () => {
    const res = await Promise.all(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i) => {
        return new Promise<number>((resolve) => {
          ctx.set({ value: i + 10 })
          setTimeout(() => {
            resolve(ctx.get().value)
          }, Math.random() * 1000)
        })
      }),
    )

    expect(res).toStrictEqual([10, 10, 10, 10, 10, 10, 10, 10, 10, 10])
  })
})
