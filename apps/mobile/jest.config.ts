/* eslint-disable max-len */
module.exports = {
  displayName: 'mobile',
  resolver: '@nrwl/jest/plugins/resolver',
  preset: 'react-native',
  // transformIgnorePatterns: ['node_modules/.pnpm/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  // transformIgnorePatterns: [
  //   // '.*',
  //   // 'node_modules.*/(?!(@react-native|jest-)?@react-native|react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)',
  // ],
  modulePathIgnorePatterns: ['e2e'],
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  moduleNameMapper: {
    '.svg': '@nrwl/expo/plugins/jest/svg-mock',
  },
};
