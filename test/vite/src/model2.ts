import * as server1 from '../../server1/src/api'

export async function change(str: string) {
  const res = [await server1.echo(str), await server1.change(), await server1.echo(str)]
  return res
}
