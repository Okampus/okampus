// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

// import {
//     PlayfairDisplay_400Regular as playfairDisplayRegular,
//     PlayfairDisplay_500Medium as playfairDisplayMedium,
//     PlayfairDisplay_600SemiBold as playfairDisplaySemiBold,
//     PlayfairDisplay_700Bold as playfairDisplayBold,
//     PlayfairDisplay_400Regular_Italic as playfairDisplayRegularItalic,
//     PlayfairDisplay_500Medium_Italic as playfairDisplayMediumItalic,
//     PlayfairDisplay_600SemiBold_Italic as playfairDisplaySemiBoldItalic,
//     PlayfairDisplay_700Bold_Italic as playfairDisplayBoldItalic,
// } from '@expo-google-fonts/playfair-display'
// import {
//     SpaceGrotesk_300Light as spaceGroteskLight,
//     SpaceGrotesk_400Regular as spaceGroteskRegular,
//     SpaceGrotesk_500Medium as spaceGroteskMedium,
//     SpaceGrotesk_600SemiBold as spaceGroteskSemiBold,
//     SpaceGrotesk_700Bold as spaceGroteskBold,
// } from '@expo-google-fonts/space-grotesk'
import { Platform } from 'react-native';

export const customFontsToLoad = {
  // spaceGroteskLight,
  // spaceGroteskRegular,
  // spaceGroteskMedium,
  // spaceGroteskSemiBold,
  // spaceGroteskBold,
  // playfairDisplayRegular,
  // playfairDisplayMedium,
  // playfairDisplaySemiBold,
  // playfairDisplayBold,
  // playfairDisplayRegularItalic,
  // playfairDisplayMediumItalic,
  // playfairDisplaySemiBoldItalic,
  // playfairDisplayBoldItalic,
  harmonySansBold: require('@okampus/assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Black.ttf'),
  harmonySansSemibold: require('@okampus/assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Bold.ttf'),
  harmonySansMedium: require('@okampus/assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Medium.ttf'),
  harmonySansRegular: require('@okampus/assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Regular.ttf'),
  harmonySansLight: require('@okampus/assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Light.ttf'),
  //   'harmonyOS-Sans-Thin': require('../../assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Thin.ttf'),
};

export type FontWeightsPrimary = 'light' | 'normal' | 'medium' | 'semiBold' | 'bold';

export type FontWeights =
  | 'thin'
  | FontWeightsPrimary
  | 'normalItalic'
  | 'mediumItalic'
  | 'semiBoldItalic'
  | 'boldItalic';

const fonts = {
  harmonySans: {
    light: 'harmonySansLight',
    normal: 'harmonySansRegular',
    medium: 'harmonySansMedium',
    semiBold: 'harmonySansSemibold',
    bold: 'harmonySansBold',
  },
  helveticaNeue: {
    // iOS only font.
    thin: 'HelveticaNeue-Thin',
    light: 'HelveticaNeue-Light',
    normal: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
  },
  courier: {
    // iOS only font.
    normal: 'Courier',
  },
  sansSerif: {
    // Android only font.
    thin: 'sans-serif-thin',
    light: 'sans-serif-light',
    normal: 'sans-serif',
    medium: 'sans-serif-medium',
  },
  monospace: {
    // Android only font.
    normal: 'monospace',
  },
};

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.harmonySans,
  /**
   * The heading font.
   */
  heading: fonts.harmonySans,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
};
