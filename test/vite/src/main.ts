import mod2, { fn1 as fn12 } from '../../server/src/folder/module2.tele'
import mod1, { aa, bbb, fn1, fn21, fn23 } from '../../server/src/module1.tele'
import { client } from './client'
import { fn3 } from './module3'

const app = document.getElementById('app')

if (app)
  Promise.all([
    client.call(mod1, 'mod1_input'),
    client.call(fn1),
    client.call(mod2, 1),
    client.call(fn12),
    client.call(fn23),
    client.call(fn21),
    client.call(aa),
    client.call(bbb),
    fn3(),
  ])
    .then((results) => {
      app.innerHTML = `<pre>${JSON.stringify(results, null, 4)}</pre>`
    })
    .catch((error: unknown) => {
      app.innerHTML = String(error)
    })

throw new Error('aaa')
