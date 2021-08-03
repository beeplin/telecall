import type { Ctx } from './types'

export function fn1(ctx: Ctx) {
  return `${ctx.userId ?? ''} m1 f1`
}

async function fn2(ctx: Ctx, input: string) {
  return { userId: ctx.userId, input, from: 'm1 f2' }
}

export default fn2

export * from './folder2/module3'

export { aa as fn21, default as fn23 } from './folder2/module3'
