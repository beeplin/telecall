import call from '../../../src/call'
import { api1 } from '../../server1/src/api'

export async function fn3() {
  const res = await call(api1, -1)
  return res
}
