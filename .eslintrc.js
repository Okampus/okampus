module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 12
  },
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/no-unresolved': ['error']
  },
  settings: {
    'import/resolver': {
      webpack: {
        alias: {
          map: [
            ['@api', './api/']
          ]
        },
        extensions: ['.js', '.less', '.json']
      }
    }
  }
}
