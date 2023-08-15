const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const defaultTheme = require('tailwindcss/defaultTheme');
const { join } = require('node:path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' or 'class's
  content: [
    join(__dirname, '{app,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: '.625rem',
        modest: '0.925rem',
      },
      screens: {
        xxs: '361px',
        xs: '408px',
        ...defaultTheme.screens,
        sm: '640px',
        md: '896px',
        xl: '1250px',
        '3xl': '1700px',
        'xxs-max': { max: '360px' },
        'xs-max': { max: '407px' },
        'sm-max': { max: '639px' },
        'md-max': { max: '895px' },
        'lg-max': { max: '1023px' },
        'xl-max': { max: '1249px' },
        '2xl-max': { max: '1535px' },
        '3xl-max': { max: '1699px' },
        short: { raw: '(max-height: 400px)' },
        tall: { raw: '(min-height: 400px)' },
      },
    },
  },
};
