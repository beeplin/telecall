module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      '../../plugins/babel-plugin-telecall.js',
      {
        '../server0/src/api': 'http://localhost:4000/api',
        '../server1/src/api': 'http://localhost:4100/api',
      },
    ],
  ],
}
