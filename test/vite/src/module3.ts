import call from '../../../src/call'
import { fn2 } from '../../server/src/api'

export async function fn3() {
  const res = await call(fn2, -1)
  return res
}
