module.exports = {
  root: true,
  env: { node: true },
  extends: ['mania', 'mania/no-type-aware'],
  parserOptions: {
    project: './test/vue/tsconfig.json',
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
}
