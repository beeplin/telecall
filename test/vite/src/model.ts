import call from '../../../src/call'
import { change, change1, echo, echo1 } from '../../server0/src/api'
import { change as change2 } from './modle2'

export async function run() {
  try {
    const results = [
      await call(echo, 'A'),
      await call(echo, 'B'),
      await call(change),
      await call(echo, 'C'),
      await call(echo, 'D'),
      await call(echo1, 'E'),
      await call(echo1, 'F'),
      await call(change1),
      await call(echo1, 'G'),
      await call(echo1, 'H'),
      await call(change2, 'I'),
      await call(echo1, 'J'),
    ]
    return results
  } catch (error: unknown) {
    return String(error)
  }
}
