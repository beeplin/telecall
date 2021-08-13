module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      '../../plugins/babel-plugin-telecall.js',
      {
        server1: {
          targetPath: '../server1/src/api',
          endpoint: 'http://localhost:4100/api',
        },
        server0: {
          targetPath: '../server0/src/api',
          endpoint: 'http://localhost:4000/api',
        },
      },
    ],
  ],
}
