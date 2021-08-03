import mod from '../../server/src/module1.tele'
import { client } from './client'

export async function fn3() {
  const res = await client.call(mod, 'from m3')
  return res
}
