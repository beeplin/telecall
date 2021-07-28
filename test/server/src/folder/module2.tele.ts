import type { Ctx } from '../types'
export async function fn1(ctx: Ctx) {
  return ctx.userId + ' m2 f1'
}

function fn2(ctx: Ctx, input: number) {
  return { userId: ctx.userId, input, from: 'm2 f2' }
}

export default fn2
