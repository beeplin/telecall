import call from '../../../src/call'
import mod2, { fn1 as fn12 } from '../../server/src/folder/module2.api'
import mod1, { aa, bbb, ff4, fn1, fn21, fn23 } from '../../server/src/module1.api'
import { fn3 } from './module3'

export async function getData() {
  try {
    const results = await Promise.all([
      call(mod1, 'mod1_input'),
      call(fn1),
      call(mod2, 1),
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
