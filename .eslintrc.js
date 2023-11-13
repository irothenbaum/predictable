module.exports = {
  root: true,
  extends: ['prettier', 'eslint:recommended', 'plugin:react/recommended'],
  plugins: ['prettier', 'react'],
  rules: {
    semi: ['error', 'never'],
    'prettier/prettier': 0,
  },
  env: {
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  }
}
