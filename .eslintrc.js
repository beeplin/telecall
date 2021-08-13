module.exports = {
  root: true,
  env: { node: true },
  extends: ['mania', 'mania/no-type-aware'],
  ignorePatterns: ['/dist', '/node_modules'],

  rules: {
    'require-await': 'off',
  },
  overrides: [
    {
      files: [
        'test/*',
        'tests/*',
        '__tests__/*',
        '*.test.js',
        '*.spec.js',
        '*.test.ts',
        '*.spec.ts',
      ],
      globals: {
        page: true,
        browser: true,
        context: true,
        jestPuppettor: true,
      },
    },
  ],
}
