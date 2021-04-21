import { accessSync, constants } from 'fs'
import path, { join } from 'path'

const { R_OK } = constants

export interface Config {
  resourceMatcher: RegExp
  resolverRootDir: string
  requestEndpoint: URL
}

interface RawConfig {
  resourceMatcher: RegExp
  resolverRootDir: string
  requestEndpoint: string
}

let config: Config | undefined

export function getConfig() {
  if (config) return config

  const filename = 'telecall.config.js'
  const directory = findConfigDirectory(filename)
  const configPath = join(directory, filename)
  // eslint-disable-next-line
  const rawConfig: RawConfig = require(configPath)(process.env)
  config = checkAndConvertRawConfig(rawConfig, directory)

  return config
}

function findConfigDirectory(filename: string) {
  let directory = process.cwd()

  while (directory) {
    try {
      accessSync(join(directory, filename), R_OK)
      break
    } catch {
      const parent = join(directory, '..')
      directory = parent !== directory ? parent : ''
    }
  }

  if (!directory)
    throw new Error(`
Cannot find ${filename} from current directory up. Please add it in your project's root directory.

Example: 

// telecall.config.js

module.exports = (env) => ({
  resourceMatcher: /\\.tele\\.(js|ts)$/,
  requestEndpoint: 'http://localhost:3000/__tele__',
  resolverRootDir: '../server/src',
})
    `)

  return directory
}

function checkAndConvertRawConfig(rawConfig: RawConfig, directory: string) {
  const { resourceMatcher, resolverRootDir, requestEndpoint } = rawConfig
  const cfg = {} as Config

  if (!(resourceMatcher instanceof RegExp))
    throw new Error(`resourceMatcher should be a RegExp`)
  cfg.resourceMatcher = resourceMatcher

  if (!(typeof resolverRootDir === 'string'))
    throw new Error(`resolverRootDir should be a string`)
  try {
    cfg.resolverRootDir = path.join(directory, resolverRootDir)
    accessSync(cfg.resolverRootDir)
  } catch {
    throw new Error(`The path indicated by resolverRootDir does not exist.`)
  }

  if (!(typeof requestEndpoint === 'string'))
    throw new Error(`requestEndpoint should be a string`)
  const tail = requestEndpoint.endsWith('/') ? '' : '/'
  try {
    cfg.requestEndpoint = new URL(requestEndpoint + tail)
  } catch {
    throw new Error(`requestEndpoint is not a valid URL.`)
  }

  return cfg
}

const toPosixPath = (str: string) => str.split(path.sep).join('/')

export function mockResource(resourcePath: string, cfg: Config) {
  const serverPath = toPosixPath(path.relative(cfg.resolverRootDir, resourcePath))
  const url = new URL(serverPath, cfg.requestEndpoint).href
  return `export default () => '${url}'`
}
