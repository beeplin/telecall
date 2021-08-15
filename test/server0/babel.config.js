module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '../../plugins/babel-plugin-telecall.js',
      {
        '../server1/src/api': 'http://localhost:4100/api',
      },
    ],
  ],
}
