/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';
import type { RootStackParamList } from '../app/types';
import type { LinkingOptions } from '@react-navigation/native';


// TODO: add deep link config
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

export default linking;
