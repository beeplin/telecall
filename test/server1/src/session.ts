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
