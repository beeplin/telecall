module.exports = {
  root: true,
  env: { node: true },
  extends: ['mania', 'mania/no-type-aware'],
  ignorePatterns: ['/lib'],
  rules: {
    'require-await': 'off',
  },
}
