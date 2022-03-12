const namingConventionForbidLeadingUnderscore = {
  selector: 'memberLike',
  modifiers: ['private'],
  format: ['camelCase'],
  leadingUnderscore: 'forbid',
  trailingUnderscore: 'allow',
};

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['noftalint/typescript'],
  ignorePatterns: ['node_modules/', './dist', './migrations/**/*.ts'],
  reportUnusedDisableDirectives: true,
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',

    'import/no-extraneous-dependencies': 'off',
    'node/no-extraneous-import': ['error', { allowModules: ['express'] }],

    'no-undefined': 'off',
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],

    // Forbid leading underscore for private properties (in nest almost all if not all class properties are private,
    // adding the underscore just impacts readability.)
    '@typescript-eslint/naming-convention': [
      ...require('eslint-config-noftalint/rules/typescript')
        .rules['@typescript-eslint/naming-convention']
        .filter(rule => rule.selector !== 'memberLike'),
      namingConventionForbidLeadingUnderscore,
    ],
  },
  overrides: [{
    files: ['*.decorator.ts', '*.decorator.js'],
    rules: {
      '@typescript-eslint/naming-convention': [
        ...require('eslint-config-noftalint/rules/typescript')
          .rules['@typescript-eslint/naming-convention']
          .filter(rule => rule.selector !== 'memberLike'),
        namingConventionForbidLeadingUnderscore,
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },
      ],
    },
  }],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
