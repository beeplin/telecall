import { getConfig, mockResource } from './utils'

const config = getConfig()

export default function (this: any, source: string) {
  return mockResource(this.resourcePath, config)
}
