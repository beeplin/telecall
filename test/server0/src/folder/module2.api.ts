import context from '../context'

export async function fn11() {
  const ctx = context.get()
  return `${ctx?.server ?? ''} m2 f1`
}

export function fn2(input: number) {
  const ctx = context.get()
  return { ctx, input, from: 'm2 f2' }
}
