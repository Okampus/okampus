import { Platform } from 'react-native';

export const customFontsToLoad = {
  harmonySansBold: require('@okampus/assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Black.ttf'),
  harmonySansSemibold: require('@okampus/assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Bold.ttf'),
  harmonySansMedium: require('@okampus/assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Medium.ttf'),
  harmonySansRegular: require('@okampus/assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Regular.ttf'),
  harmonySansLight: require('@okampus/assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Light.ttf'),
  harmonySansThin: require('@okampus/assets/fonts/HarmonyOS_Sans/HarmonyOS_Sans_Thin.ttf'),
  lexendBold: require('@okampus/assets/fonts/Lexend/Lexend-Bold.ttf'),
  lexendSemibold: require('@okampus/assets/fonts/Lexend/Lexend-SemiBold.ttf'),
  lexendMedium: require('@okampus/assets/fonts/Lexend/Lexend-Medium.ttf'),
  lexendRegular: require('@okampus/assets/fonts/Lexend/Lexend-Regular.ttf'),
  lexendLight: require('@okampus/assets/fonts/Lexend/Lexend-Light.ttf'),
  lexendThin: require('@okampus/assets/fonts/Lexend/Lexend-Thin.ttf'),
  spaceMonoRegular: require('@okampus/assets/fonts/SpaceMono/SpaceMono-Regular.ttf'),
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
  lexend: {
    thin: 'lexendThin',
    light: 'lexendLight',
    normal: 'lexendRegular',
    medium: 'lexendMedium',
    semiBold: 'lexendSemibold',
    bold: 'lexendBold',
  },
  spaceMono: {
    normal: 'spaceMonoRegular',
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
   * The heading font. Used in headings.
   */
  heading: fonts.lexend,
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  code: fonts.spaceMono,
};
