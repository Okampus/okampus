/* eslint-disable */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:import/recommended'
  ],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/no-unresolved': ['error']
  }
}
