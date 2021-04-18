import { NextFunction, Request, Response } from 'express';
export interface Context {
    req: Request;
    res: Response;
}
declare type Headers = Record<string, string>;
interface Options {
    extraHeaders?: Headers;
    convertResolverPath?: (input: string) => string;
}
declare const _default: {
    port: number;
    path: string;
    middleware({ extraHeaders, convertResolverPath }?: Options): (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default _default;
