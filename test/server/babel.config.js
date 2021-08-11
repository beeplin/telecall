module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '../../plugins/babel-plugin-telecall.js',
      {
        server1: {
          endpoint: 'http://localhost:4100/api',
          targetPath: '../server1/src/api',
        },
        server2: {
          endpoint: 'http://localhost:4200/api',
          targetPath: '../server2/src/api',
        },
      },
    ],
  ],
}
