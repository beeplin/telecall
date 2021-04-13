'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var utils_1 = require('./utils')
var config = utils_1.getConfig()
var resourceMatcher = config.resourceMatcher
function default_1() {
  return {
    name: 'telecall',
    resolveId: function (resourcePath) {
      if (resourceMatcher.test(resourcePath)) return resourcePath
      return null
    },
    load: function (resourcePath) {
      if (resourceMatcher.test(resourcePath))
        return utils_1.mockResource(resourcePath, config)
      return null
    },
  }
}
exports.default = default_1
