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
        server1: {
          include: '../server1/src/**/*.api(.ts|.js|.cjs|.mjs|)',
          root: '../server1/src',
          endpoint: 'http://localhost:4100/api',
          persistence: 'localStorage',
        },
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
