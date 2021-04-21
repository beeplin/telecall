/// <reference lib="dom" />
type MockedFn = (...args: unknown[]) => string
type UnPromise<T> = T extends Promise<infer U> ? U : T
type Headers = Record<string, string>
type RestParams<T> = T extends (first: unknown, ...rest: infer U) => unknown ? U : never

const method = 'POST'
const headers: Headers = { 'content-type': 'application/json' }

export default async function telecall<T extends MockedFn>(
  mockedFn: T,
  ...args: RestParams<T>
): Promise<UnPromise<ReturnType<T>>> {
  const result = await fetch(mockedFn(), {
    method,
    headers,
    body: JSON.stringify(args),
  })
  return result.json()
}

telecall.addHeaders = (newHeaders: Headers) => {
  Object.assign(headers, newHeaders)
}

telecall.removeHeaders = (...headerKeys: string[]) => {
  headerKeys.forEach((key) => delete headers[key])
}
