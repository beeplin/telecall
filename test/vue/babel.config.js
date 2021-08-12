module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      '../../plugins/babel-plugin-telecall.js',
      {
        server1: {
          endpoint: 'http://localhost:4100/api',
          targetPath: '../server1/src/api',
        },
        server0: {
          endpoint: 'http://localhost:4000/api',
          targetPath: '../server0/src/api',
        },
      },
    ],
  ],
}
