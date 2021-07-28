import type { Fn, TeleRequest, TeleResponse } from './types'
export declare function handleTeleRequest<T extends Fn>(
  request: TeleRequest<T>,
  ctx: unknown,
): Promise<{
  status: number
  json: TeleResponse<T>
}>
//# sourceMappingURL=server.d.ts.map
