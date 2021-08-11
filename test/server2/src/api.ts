import context from './context'

export function api1(input: number) {
  const ctx = context.get()
  return { ...ctx, input }
}

export async function api2(input: string, input2: number) {
  const ctx = context.get()
  return { ...ctx, input, input2 }
}
