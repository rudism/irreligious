module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [ '@typescript-eslint' ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/triple-slash-reference': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/explicit-function-return-type': 1,
    'quotes': [2, 'single', {avoidEscape: true},],
    'no-extra-parens': 1,
    'consistent-return': 1,
    'no-eq-null': 1,
    'no-implicit-globals': 1
  }
};
