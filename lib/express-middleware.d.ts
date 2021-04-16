import { Application, NextFunction, Request, Response } from 'express';
export interface Context {
    req: Request;
    res: Response;
}
declare type Headers = Record<string, string>;
interface Options {
    headers: Headers;
}
export default function (app: Application, options?: Options): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
