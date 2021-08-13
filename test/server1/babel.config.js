module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '../../plugins/babel-plugin-telecall.js',
      {
        server2: {
          targetPath: '../server2/src/api',
          endpoint: 'http://localhost:4200/api',
        },
      },
    ],
  ],
}
