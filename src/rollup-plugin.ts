import { getConfig, mockResource } from './utils'

const config = getConfig()
const { resourceMatcher } = config

export default function () {
  return {
    name: 'telecall',
    resolveId(resourcePath: string) {
      if (resourceMatcher.test(resourcePath)) return resourcePath
      return null
    },
    load(resourcePath: string) {
      if (resourceMatcher.test(resourcePath)) return mockResource(resourcePath, config)
      return null
    },
  }
}
