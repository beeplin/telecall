declare type Func = (...args: any) => any;
declare type UnPromise<T> = T extends Promise<infer U> ? U : T;
declare type Headers = Record<string, string>;
declare type RestParams<T> = T extends (first: any, ...rest: infer U) => any ? U : never;
declare function telecall<T extends Func>(mockedFn: T, ...args: RestParams<T>): Promise<UnPromise<ReturnType<T>>>;
declare namespace telecall {
    var addHeaders: (newHeaders: Headers) => void;
    var removeHeaders: (...headerKeys: string[]) => void;
}
export default telecall;
