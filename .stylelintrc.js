const functionNoUnknown = [
  true,
  {
    ignoreFunctions: ['global'],
  },
];

const atRuleNoUnknown = [
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
      'value',
    ],
  },
];

module.exports = {
  root: true,
  extends: [
    'stylelint-config-standard-scss', // configure for SCSS
    'stylelint-config-prettier', // turn off any rules that conflict with Prettier
    'stylelint-config-clean-order', // configure for a logical order of CSS properties
  ],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['export', 'import', 'global', 'local', 'external'],
      },
    ],
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['from'],
      },
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes', 'compose-with'],
        ignoreSelectors: [':export', /^:import/],
      },
    ],
    'function-no-unknown': functionNoUnknown,
    'scss/function-no-unknown': functionNoUnknown,
    'rule-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'at-rule-semicolon-space-before': 'never',
    'at-rule-no-unknown': atRuleNoUnknown,
    'scss/at-rule-no-unknown': atRuleNoUnknown,
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
