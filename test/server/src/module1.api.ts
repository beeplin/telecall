import { getContext } from './context'

export function fn1() {
  const ctx = getContext()
  return { ctx }
}

async function fn2(input: string) {
  const ctx = getContext()
  return { ctx, input, from: 'm1 f2' }
}

export default fn2

export * from './folder2/module3'

export { aa as fn21, default as fn23 } from './folder2/module3'
