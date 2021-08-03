export const a = 1

export async function f1() {}

export function f2() {}

export class C1 {}

export * from './a'

export { a as aa, b as bb } from './b'

export * as abc from './c'

export { f3, f4 as ff4 }

function f3() {
  return '------'
}

function f4() {}

export default f3
