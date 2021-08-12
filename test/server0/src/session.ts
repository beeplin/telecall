import call from '../../../dist/call'
import * as server1 from '../../server1/src/api'
import context from './context'

export async function login(id: string) {
  const ctx = context.get()
  await ctx.session.start(id)
  return { server: ctx.server, method: login.name, id: ctx.session.id }
}

export async function logout() {
  const ctx = context.get()
  await ctx.session.end()
  return { server: ctx.server, method: logout.name, id: ctx.session.id }
}

export function echo(name: string) {
  const ctx = context.get()
  return { server: ctx.server, method: echo.name, id: ctx.session.id, name }
}

export async function login1(id: string) {
  const ctx = context.get()
  const res = await call(server1.login, id)
  return { server: ctx.server, method: login1.name, id: ctx.session.id, res }
}

export async function logout1() {
  const ctx = context.get()
  const res = await call(server1.logout)
  return { server: ctx.server, method: logout1.name, id: ctx.session.id, res }
}

export async function echo1(name: string) {
  const ctx = context.get()
  const res = await call(server1.echo, name)
  return { server: ctx.server, method: echo1.name, id: ctx.session.id, res }
}
