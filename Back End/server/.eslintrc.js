module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base', 
    'plugin:node/recommended', 
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
  },
};