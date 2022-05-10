module.exports = {
    extends: [
        'stylelint-config-standard-scss', // configure for SCSS
        'stylelint-config-recommended-vue/scss', // add overrides for .Vue files
        'stylelint-config-recess-order', // use the recess order for properties
        'stylelint-config-css-modules', // configure for CSS Modules methodology
        'stylelint-config-prettier', // turn off any rules that conflict with Prettier
    ],
    rules: {
        indentation: 4,
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': [
            true,
            {
                'ignoreAtRules': ['extends', 'tailwind'],
            },
        ],
    },
}
