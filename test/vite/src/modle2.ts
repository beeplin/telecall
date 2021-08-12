import call from '../../../src/call'
import * as server1 from '../../server1/src/api'

export async function change(str: string) {
  const res = [
    await call(server1.echo, str),
    await call(server1.change),
    await call(server1.echo, str),
  ]
  return res
}
