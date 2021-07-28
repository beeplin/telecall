module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      '../../plugins/babel-plugin-telecall.js',
      {
        include: '../server/src/**/*.tele(.ts|.js|)',
        root: '../server/',
      },
    ],
  ],
}
