declare type Func = (...args: any) => any
declare type UnPromise<T> = T extends Promise<infer U> ? U : T
declare type Headers = Record<string, string>
declare function telecall<T extends Func>(
  mockedFn: T,
  ...args: Parameters<T>
): Promise<UnPromise<ReturnType<T>>>
declare namespace telecall {
  var addHeaders: (newHeaders: Headers) => void
  var removeHeaders: (...headerKeys: string[]) => void
}
export default telecall
