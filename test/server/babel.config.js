module.exports = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    [
      '../../plugins/babel-plugin-telecall.js',
      [
        {
          include: '../server1/src/**/*.api.(ts|js|cjs|mjs)',
          root: '../server2/',
        },
        {
          include: '../server2/src/**/*.api.(ts|js|cjs|mjs)',
          root: '../server2/',
        },
      ],
    ],
  ],
}
