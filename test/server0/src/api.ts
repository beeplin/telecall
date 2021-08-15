import * as server1 from '../../server1/src/api'
import context from './context'

export async function echo(input: string) {
  const ctx = context.get()
  return { server: ctx.server, method: echo.name, id: ctx.session.id, input }
}

export async function change() {
  const ctx = context.get()
  ctx.session.changeId()
  return { server: ctx.server, method: change.name, id: ctx.session.id }
}

export async function echo1(name: string) {
  const ctx = context.get()
  const res = await server1.echo(name)
  return { server: ctx.server, method: echo1.name, id: ctx.session.id, res }
}

export async function change1() {
  const ctx = context.get()
  const res = await server1.change()
  return { server: ctx.server, method: change1.name, id: ctx.session.id, res }
}
