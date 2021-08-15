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
