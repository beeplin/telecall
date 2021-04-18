'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k]
          },
        })
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.mockResource = exports.getConfig = void 0
var fs_1 = require('fs')
var path_1 = __importStar(require('path'))
var R_OK = fs_1.constants.R_OK
var config
function getConfig() {
  if (config) return config
  var filename = 'telecall.config.js'
  var directory = findConfigDirectory(filename)
  var configPath = path_1.join(directory, filename)
  var rawConfig = require(configPath)(process.env)
  config = checkAndConvertRawConfig(rawConfig, directory)
  return config
}
exports.getConfig = getConfig
function findConfigDirectory(filename) {
  var directory = process.cwd()
  while (directory) {
    try {
      fs_1.accessSync(path_1.join(directory, filename), R_OK)
      break
    } catch (_a) {
      var parent_1 = path_1.join(directory, '..')
      directory = parent_1 !== directory ? parent_1 : ''
    }
  }
  if (!directory)
    throw new Error(
      '\nCannot find ' +
        filename +
        " from current directory up. Please add it in your project's root directory.\n\nExample: \n\n// telecall.config.js\n\nmodule.exports = (env) => ({\n  resourceMatcher: /.tele.(js|ts)$/,\n  requestEndpoint: 'http://localhost:3000/__tele__',\n  resolverBasePath: '../server/src',\n})\n    ",
    )
  return directory
}
function checkAndConvertRawConfig(rawConfig, directory) {
  var resourceMatcher = rawConfig.resourceMatcher,
    resolverBasePath = rawConfig.resolverBasePath,
    requestEndpoint = rawConfig.requestEndpoint
  var config = {}
  if (!(resourceMatcher instanceof RegExp))
    throw new Error('resourceMatcher should be a RegExp')
  config.resourceMatcher = resourceMatcher
  if (!(typeof resolverBasePath === 'string'))
    throw new Error('resourceMatcher should be a string')
  try {
    config.resolverBasePath = path_1.default.join(directory, resolverBasePath)
    fs_1.accessSync(config.resolverBasePath)
  } catch (_a) {
    throw new Error('The path indicated by resolverBasePath does not exist.')
  }
  if (!(typeof requestEndpoint === 'string'))
    throw new Error('requestEndpoint should be a string')
  var tail = requestEndpoint.endsWith('/') ? '' : '/'
  try {
    config.requestEndpoint = new URL(requestEndpoint + tail)
  } catch (_b) {
    throw new Error('requestEndpoint is not a valid URL.')
  }
  return config
}
var toPosixPath = function (str) {
  return str.split(path_1.default.sep).join('/')
}
function mockResource(resourcePath, config) {
  var serverPath = toPosixPath(
    path_1.default.relative(config.resolverBasePath, resourcePath),
  )
  var url = new URL(serverPath, config.requestEndpoint).href
  return "export default () => '" + url + "'"
}
exports.mockResource = mockResource
