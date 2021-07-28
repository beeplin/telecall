module.exports = {
  root: true,
  env: { node: true },
  extends: ['mania'],
  ignorePatterns: ['/test/**/*'],
  rules: {
    '@typescript-eslint/no-unsafe-return': ['off'],
  },
}
