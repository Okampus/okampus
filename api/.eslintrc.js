module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['noftalint/typescript'],
  ignorePatterns: ['node_modules/', './dist', './src/migrations/**/*.ts'],
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
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-import-module-exports': 'off',

    'node/no-extraneous-import': ['error', { allowModules: ['express'] }],
    'node/callback-return': 'off',

    '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
    // Forbid leading underscore for private properties (in nest almost all if not all class properties are private,
    // adding the underscore just impacts readability.)
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'objectLiteralProperty',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'enumMember',
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'allow',
      },
    ],
  },
  overrides: [{
    files: ['*.config.ts', '*.config.js'],
    rules: {
      'import/no-commonjs': 'off',
      'node/no-unpublished-import': 'off',
      'node/no-unpublished-require': 'off',
      'import/no-extraneous-dependencies': 'off',
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
