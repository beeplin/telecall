import { getConfig, mockResource } from './utils'

const config = getConfig()

export default function telecallLoader() {
  // @ts-ignore
  return mockResource(this.resourcePath, config)
}
