module.exports = {
  extends: 'stylelint-config-standard-scss',
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss'
    }
  ],
  rules: {
    indentation: 4,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': [ true, {
      'ignoreAtRules': [
        'extends',
        'tailwind'
      ]
    }]
  }
}
