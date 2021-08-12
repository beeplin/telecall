import call from '../../../src/call'
import { echo, echo1, login, login1, logout, logout1 } from '../../server0/src/api'
import { login as login2 } from './modle2'

export async function run() {
  try {
    const results = [
      await call(echo, '0'),
      await call(login, 'AAA'),
      await call(echo, '2'),
      await call(echo1, 'a'),
      await call(login1, 'BBB'),
      await call(echo1, 'b'),
      await call(logout),
      await call(echo, '4'),
      await call(echo1, 'c'),
      await call(logout1),
      await call(echo1, 'd'),
      await call(login, 'CCC'),
      await call(login1, 'EEE'),
      await call(login2, 'DDD', 'echo'),
    ]
    return results
  } catch (error: unknown) {
    return String(error)
  }
}
