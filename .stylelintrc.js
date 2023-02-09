module.exports = {
  root: true,
  extends: [
    'stylelint-config-standard-scss', // configure for SCSS
    'stylelint-config-css-modules', // configure for CSS Modules methodology
    'stylelint-config-prettier', // turn off any rules that conflict with Prettier
    'stylelint-config-clean-order', // configure for a logical order of CSS properties
  ],
  rules: {
    'rule-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'at-rule-semicolon-space-before': 'never',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'function',
          'if',
          'else',
          'return',
          'each',
          'include',
          'mixin',
          'define-mixin',
          'tailwind',
          'apply',
        ],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'function',
          'if',
          'else',
          'return',
          'each',
          'include',
          'mixin',
          'define-mixin',
          'tailwind',
          'apply',
        ],
      },
    ],
    'block-closing-brace-newline-after': [
      'always',
      {
        ignoreAtRules: ['if', 'else'],
      },
    ],
    'declaration-empty-line-before': null,
    'selector-list-comma-newline-after': null,
  },
};
