import call from '../../../src/call'
import mod from '../../server/src/module1.api'

export async function fn3() {
  const res = await call(mod, 'from m3')
  return res
}
