import '../../../src'
import { change, change1, echo, echo1 } from '../../server0/src/api'
import { change as change2 } from './model2'

export async function run() {
  try {
    const results = [
      await echo('A'),
      await echo('B'),
      await change(),
      await echo('C'),
      await echo('D'),
      await echo1('E'),
      await echo1('F'),
      await change1(),
      await echo1('G'),
      await echo1('H'),
      await change2('I'),
      await echo1('J'),
    ]
    return results
  } catch (error: unknown) {
    return String(error)
  }
}
