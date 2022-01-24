module.exports = {
    root: true,
    env: { node: true },
    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:tailwindcss/recommended',
        'eslint:recommended',
        'prettier',
    ],
    ignorePatterns: ['dist/*', 'node_modules/*'],
    rules: {
        'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: true }],
        'vue/arrow-spacing': ['error', {
            before: true,
            after: true, 
        }],

        'arrow-body-style': ['error', 'as-needed'],
        'tailwindcss/no-custom-classname': 'off',
        quotes: ['error', 'single', { avoidEscape: true }],
        'comma-dangle': ['error', 'always-multiline'],

        'arrow-spacing': 'error',
        'keyword-spacing': 'error',
        'space-before-blocks': 'error',
        'key-spacing': [
            'error',
            {
                beforeColon: false,
                afterColon: true,
            },
        ],

        'object-curly-spacing': ['error', 'always'],
        'object-curly-newline': [
            'error',
            {
                multiline: true,
                minProperties: 2,
            },
        ],
        'object-property-newline': 'error',

        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

        indent: ['error', 4],
    },
}
