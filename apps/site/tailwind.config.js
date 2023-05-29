const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const defaultTheme = require('tailwindcss/defaultTheme');
const { join } = require('node:path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' or 'class's
  content: [
    join(__dirname, '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      gap: {
        item: '.85rem',
      },
      fontSize: {
        xxs: '.625rem',
        modest: '0.925rem',
      },
      fontFamily: {
        sans: ['ClarityCity', ...defaultTheme.fontFamily.sans],
        mono: ['ChivoMono', ...defaultTheme.fontFamily.mono],
      },
      screens: {
        xxs: '361px',
        xs: '408px',
        ...defaultTheme.screens,
        xl: '1440px',
        '3xl': '1800px',
        'xxs-max': { max: '360px' },
        'xs-max': { max: '407px' },
        'sm-max': { max: '639px' },
        'md-max': { max: '767px' },
        'lg-max': { max: '1023px' },
        'xl-max': { max: '1439px' },
        '2xl-max': { max: '1535px' },
        '3xl-max': { max: '1799px' },
        short: { raw: '(max-height: 500px)' },
        tall: { raw: '(min-height: 500px)' },
      },
    },
  },
};
