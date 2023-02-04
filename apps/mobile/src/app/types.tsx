/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import type { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { IconProps } from '@expo/vector-icons/build/createIconSet';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';

// declare global {
//     namespace ReactNavigation {
//         interface RootParamList extends RootStackParamList {}
//     }
// }

export type RootTabParamList = Record<string, undefined>;

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;
export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MaterialCommunityIconsGlyphs = keyof typeof MaterialCommunityIcons.glyphMap;
export type IoniconsGlyphs = keyof typeof Ionicons.glyphMap;

export type MaterialCommunityIconsWrapper = (props: IconProps<MaterialCommunityIconsGlyphs>) => JSX.Element;
export type IoniconsWrapper = (props: IconProps<IoniconsGlyphs>) => JSX.Element;

export type TabOptions = MaterialTabOptions | IonIconTabOptions;

export interface MaterialTabOptions {
  name: string;
  icon: MaterialCommunityIconsWrapper;
  iconActive: MaterialCommunityIconsGlyphs;
  iconInactive: MaterialCommunityIconsGlyphs;
  size: number;
  component: React.ComponentType<any>;
}

export interface IonIconTabOptions {
  name: string;
  icon: IoniconsWrapper;
  iconActive: IoniconsGlyphs;
  iconInactive: IoniconsGlyphs;
  size: number;
  component: React.ComponentType<any>;
}
