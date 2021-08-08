module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      '../../plugins/babel-plugin-telecall.js',
      {
        include: '../server/src/**/*.api(.ts|.js|)',
        root: '../server/src',
        endpoint: 'http://localhost:4000/api',
        persistence: 'localStorage',
      },
    ],
  ],
}
