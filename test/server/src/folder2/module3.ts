import call from '../../../../dist/call'
import { api1 } from '../../../server1/src/api'
import { getContext } from '../context'

export async function f1() {}

export function f2() {}

export * from './a'

export { a as aa, b as bb } from './b'

// export * as abc from './c'
export { f3, f4 as ff4 }

function f3() {
  const ctx = getContext()
  return { ctx, cwd: process.cwd() }
}

async function f4() {
  const ctx = getContext()
  const res = await call(api1, 4)
  return { ctx, res, from: 'ff4' }
}

export default f3
