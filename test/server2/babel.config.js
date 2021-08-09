module.exports = {
  sourceMaps: 'inline', // NOTE 'true' does not work
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
}
