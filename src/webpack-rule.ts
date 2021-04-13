import path from 'path'
import { getConfig } from './utils'

const config = getConfig()

module.exports = function webpackRule() {
  return {
    test: config.resourceMatcher,
    use: path.join(__dirname, 'webpack-loader'),
    exclude: /node_modules/,
  }
}
