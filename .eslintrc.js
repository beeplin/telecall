module.exports = {
  root: true,
  env: { node: true },
  extends: ['mania'],
  ignorePatterns: ['/test/', '/lib'],
  rules: {
    '@typescript-eslint/no-unsafe-return': ['off'],
  },
}
