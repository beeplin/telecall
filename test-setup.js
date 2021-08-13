/* eslint-disable @typescript-eslint/no-magic-numbers */
const { setup: setupDevServer } = require('jest-dev-server')
const { setup: setupPuppeteer } = require('jest-environment-puppeteer')

module.exports = async function globalSetup(globalConfig) {
  await setupPuppeteer(globalConfig)
  await setupDevServer([
    {
      command: 'cd test/vite && npm run build && npm run dev',
      port: 3000,
    },
    {
      command: 'cd test/server0 && npm start',
      port: 4000,
    },
    {
      command: 'cd test/server1 && npm start',
      port: 4100,
    },
  ])
}
