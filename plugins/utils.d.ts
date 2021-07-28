import type { FilterPattern } from '@rollup/pluginutils'

export interface TeleOptions {
  include: FilterPattern
  exclude?: FilterPattern
  root: string
}

export declare function isTele(fullPath: string, options: TeleOptions): boolean

export declare async function convertTele(
  fullPath: string,
  options: TeleOptions,
): Promise<string>

export declare function getRelativePath(fullPath: string, options: TeleOptions): string
