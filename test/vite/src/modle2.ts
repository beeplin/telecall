import call from '../../../src/call'
import * as server1 from '../../server1/src/api'

export async function login(id: string, str: string) {
  const res = [await call(server1.login, id), await call(server1.echo, str)]
  return res
}
