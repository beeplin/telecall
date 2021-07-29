module.exports = {
  root: true,
  env: { node: true },
  extends: ['mania'],
  parserOptions: {
    project: './test/vue/tsconfig.json',
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
}
