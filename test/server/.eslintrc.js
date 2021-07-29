module.exports = {
  root: true,
  env: { node: true },
  extends: ['mania'],
  parserOptions: {
    project: './test/server/tsconfig.json',
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
}
