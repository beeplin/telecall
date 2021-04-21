module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-use-before-define': ['error', { functions: false }],
    'import/extensions': 'off',
    // "import/no-extraneous-dependencies": "off",
    'import/no-unresolved': 'off',
    // "import/prefer-default-export": "off",
    // "no-nested-ternary": "off",
    // "no-underscore-dangle": "off",
  },
}
