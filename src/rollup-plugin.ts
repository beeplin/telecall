import { getConfig, mockResource } from './utils'

const config = getConfig()
const { resourceMatcher } = config

export default function () {
  return {
    name: 'telecall',
    resolveId(id: string) {
      if (resourceMatcher.test(id)) return id
      return null
    },
    load(id: string) {
      if (resourceMatcher.test(id)) return mockResource(id, config)
      return null
    },
  }
}
