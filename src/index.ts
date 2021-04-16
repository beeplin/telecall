type Func = (...args: any) => any
type UnPromise<T> = T extends Promise<infer U> ? U : T
type Headers = Record<string, string>
type RestParams<T> = T extends (first: any, ...rest: infer U) => any ? U : never

const method = 'POST'
const headers: Headers = { 'content-type': 'application/json' }

export default async function telecall<T extends Func>(
  mockedFn: T,
  ...args: RestParams<T>
) {
  const result = await fetch(mockedFn(), {
    method,
    headers,
    body: JSON.stringify(args),
  })
  return result.json() as UnPromise<ReturnType<T>>
}

telecall.addHeaders = (newHeaders: Headers) => {
  Object.assign(headers, newHeaders)
}

telecall.removeHeaders = (...headerKeys: string[]) => {
  headerKeys.forEach((key) => delete headers[key])
}
