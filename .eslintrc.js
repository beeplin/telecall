module.exports = {
  root: true,
  env: { node: true },
  extends: ['mania', 'mania/no-type-aware'],
  ignorePatterns: ['/lib', '/node_modules'],
  rules: {
    'require-await': 'off',
  },
}
