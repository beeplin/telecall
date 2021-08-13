module.exports = {
  preset: 'jest-puppeteer',
  transform: {
    '^.+\\.tsx?$': ['esbuild-jest', { sourcemap: true }],
  },
  globalSetup: '<rootDir>/test-setup.js',
  globalTeardown: '<rootDir>/test-teardown.js',

  collectCoverage: true,

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],

  coverageReporters: [
    // 'json',
    'text',
    // 'lcov', // 会导致 vscode jest 无限循环
    'clover',
  ],
}
