module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
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
    'import/no-unresolved': ['error'],
    'vue/html-self-closing': ['off']
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
