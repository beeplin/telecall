const path = require('path')

module.exports = {
  root: true,
  env: { node: true },
  extends: ['mania'],
  parserOptions: {
    project: path.join(__dirname, './tsconfig.json'),
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
}
