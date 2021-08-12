import { run } from './model'

const app = document.getElementById('app')

run()
  .then((res) => {
    if (app) app.innerHTML = `<pre>${JSON.stringify(res, null, 4)}</pre>`
  })
  .catch((e: unknown) => e)
