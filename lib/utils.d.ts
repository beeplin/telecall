export interface Config {
  resourceMatcher: RegExp
  resolverBasePath: string
  requestEndpoint: URL
}
export declare function getConfig(): Config
export declare function mockResource(resourcePath: string, config: Config): string
