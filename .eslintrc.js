module.exports = {
  plugins: ['simple-import-sort'],
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {},
  rules: {
    'simple-import-sort/sort': 2,
  },
};
