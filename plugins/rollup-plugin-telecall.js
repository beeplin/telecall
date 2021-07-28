import { convertTele, isTele } from './utils'

export default function telecall(options) {
  return {
    name: 'telecall',
    async load(id) {
      if (isTele(id, options)) return convertTele(id, options)
      return null
    },
  }
}
