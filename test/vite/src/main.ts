import mod2, { fn1 as fn1_2 } from '../../server/src/folder/module2.tele'
import mod1, { fn1 } from '../../server/src/module1.tele'
import { client } from './client'
import { fn3 } from './module3'

const app = document.getElementById('app')

if (app)
  Promise.all([
    client.call(mod1, 'mod1_input'),
    client.call(fn1),
    client.call(mod2, 1),
    client.call(fn1_2),
    fn3(),
  ])
    .then((results) => {
      app.innerHTML = `<pre>${JSON.stringify(results, null, 4)}</pre>`
    })
    .catch((error) => {
      app.innerHTML = error
    })
