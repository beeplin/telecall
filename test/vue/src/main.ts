import { getData } from './model'

const app = document.getElementById('app')

getData()
  .then((res) => {
    if (app) app.innerHTML = res
  })
  .catch((e: unknown) => e)
