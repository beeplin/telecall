import call from '../../../src/call'
import { aa, bbb, ff4, fn1, fn1 as fn12, fn21, fn23 } from '../../server0/src/api'
import { fn3 } from './module3'

export async function getData() {
  try {
    const results = await Promise.all([
      call(fn1),
      call(fn12),
      call(fn23),
      call(fn21),
      call(aa),
      call(bbb),
      call(ff4),
      fn3(),
    ])
    return `<pre>${JSON.stringify(results, null, 4)}</pre>`
  } catch (error: unknown) {
    return String(error)
  }
}
