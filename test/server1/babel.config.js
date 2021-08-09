module.exports = {
  sourceMaps: 'inline', // NOTE 'true' does not work
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '../../plugins/babel-plugin-telecall.js',
      {
        server2: {
          include: '../server2/src/**/*.api(.ts|.js|.cjs|.mjs|)',
          root: '../server2/src',
          endpoint: 'http://localhost:4200/api',
          persistence: 'localStorage',
        },
      },
    ],
  ],
}
