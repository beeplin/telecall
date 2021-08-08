import { getContext } from '../context'

export async function fn1() {
  const ctx = getContext()
  return `${ctx.server ?? ''} m2 f1`
}

function fn2(input: number) {
  const ctx = getContext()
  return { ctx, input, from: 'm2 f2' }
}

export default fn2
