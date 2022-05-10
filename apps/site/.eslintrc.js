module.exports = {
    root: true,
    parserOptions: {
        'ecmaVersion': 'latest',
    },
    env: { node: true, es2021: true, 'vue/setup-compiler-macros': true },
    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:tailwindcss/recommended',
        'eslint:recommended',
        'prettier',
    ],
    ignorePatterns: ['dist/*', 'node_modules/*'],
    rules: {
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/arrow-spacing': ['error', { before: true, after: true }],

        'arrow-body-style': ['error', 'as-needed'],
        'tailwindcss/no-custom-classname': 'off',
        'tailwindcss/enforces-negative-arbitrary-values': 'off',

        quotes: ['error', 'single', { avoidEscape: true }],
        'comma-dangle': ['error', 'always-multiline'],

        'arrow-spacing': ['error', { before: true, after: true }],
        'key-spacing': ['error', { beforeColon: false, afterColon: true }],
        'keyword-spacing': 'error',

        'space-before-blocks': 'error',

        'object-curly-spacing': ['error', 'always'],

        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
}
