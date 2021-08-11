import call from '../../../../dist/call'
import { api2 } from '../../../server2/src/api'
import { getContext } from '../context'

export function b() {}

export async function a() {
  const ctx = getContext()
  const res = await call(api2, 'b.ts', 2)
  return { ctx, text: '===============', res }
}
