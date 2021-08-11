import call from '../../../dist/call'
import { api1 as api12, api2 as api22 } from '../../server2/src/api'
import context from './context'

export async function api1(input: number) {
  const ctx = context.get()
  const res = await call(api12, 1)
  return { ...ctx, input, res }
}

export async function api2(input: string) {
  const ctx = context.get()
  const res = await call(api22, 'input', 2)
  return { ...ctx, input, res }
}
