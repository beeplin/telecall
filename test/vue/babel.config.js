module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      '../../plugins/babel-plugin-telecall.js',
      {
        server: {
          endpoint: 'http://localhost:4000/api',
          targetPath: '../server/src/api',
        },
      },
    ],
  ],
}
