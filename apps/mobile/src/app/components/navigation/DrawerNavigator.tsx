import { BottomTabNavigator } from './BottomTabNavigator';
import { Sidebar } from './Sidebar';
import { NotFoundScreen } from '../../screens/NotFoundScreen';

import React from 'react';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';

import type {
  IoniconsGlyphs,
  IoniconsWrapper,
  MaterialCommunityIconsGlyphs,
  MaterialCommunityIconsWrapper,
  TabOptions,
} from '../../types';
import type { OpaqueColorValue } from 'react-native';

const Drawer = createDrawerNavigator();

export type MCIconWrapperProps = {
  name: MaterialCommunityIconsGlyphs;
  color?: string | OpaqueColorValue;
  size?: number;
};

export type IonIconWrapperProps = {
  name: IoniconsGlyphs;
  color?: string | OpaqueColorValue;
  size?: number;
};

const MaterialCommunityIconWrapper: MaterialCommunityIconsWrapper = ({ name, color, size }: MCIconWrapperProps) => (
  <MaterialCommunityIcons name={name} color={color} size={size} />
);

const IonIconWrapper: IoniconsWrapper = ({ name, color, size }: IonIconWrapperProps) => (
  <Ionicons name={name} color={color} size={size} />
);

const homeTabs: TabOptions[] = [
  {
    name: 'Home',
    icon: MaterialCommunityIconWrapper,
    iconActive: 'home',
    iconInactive: 'home-outline',
    size: 27,
    component: NotFoundScreen,
  },
  {
    name: 'DMs',
    icon: MaterialCommunityIconWrapper,
    iconActive: 'chat',
    iconInactive: 'chat-outline',
    size: 30,
    component: NotFoundScreen,
  },
  {
    name: 'Mentions',
    icon: MaterialCommunityIconWrapper,
    iconActive: 'inbox',
    iconInactive: 'inbox-outline',
    size: 30,
    component: NotFoundScreen,
  },
  {
    name: 'Search',
    icon: IonIconWrapper,
    iconActive: 'search-circle',
    iconInactive: 'search-circle-outline',
    size: 32,
    component: NotFoundScreen,
  },
  {
    name: 'You',
    icon: MaterialCommunityIconWrapper,
    iconActive: 'account-box',
    iconInactive: 'account-box-outline',
    size: 30,
    component: NotFoundScreen,
  },
];

const manageTabs: TabOptions[] = [
  {
    name: 'Dashboard',
    icon: MaterialCommunityIconWrapper,
    iconActive: 'view-dashboard',
    iconInactive: 'view-dashboard-outline',
    size: 30,
    component: NotFoundScreen,
  },
  {
    name: 'Members',
    icon: MaterialCommunityIconWrapper,
    iconActive: 'account-group',
    iconInactive: 'account-group-outline',
    size: 30,
    component: NotFoundScreen,
  },
  {
    name: 'Treasury',
    icon: MaterialCommunityIconWrapper,
    iconActive: 'credit-card',
    iconInactive: 'credit-card-outline',
    size: 30,
    component: NotFoundScreen,
  },
  {
    name: 'Events',
    icon: MaterialCommunityIconWrapper,
    iconActive: 'party-popper',
    iconInactive: 'party-popper',
    size: 30,
    component: NotFoundScreen,
  },
  {
    name: 'Posts',
    icon: MaterialCommunityIconWrapper,
    iconActive: 'bullhorn',
    iconInactive: 'bullhorn-outline',
    size: 30,
    component: NotFoundScreen,
  },
];

const DrawerNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />} screenOptions={{ headerShown: false }}>
    <Drawer.Screen name="General">{(props) => <BottomTabNavigator {...props} tabs={homeTabs} />}</Drawer.Screen>
    <Drawer.Screen name="Manage">{(props) => <BottomTabNavigator {...props} tabs={manageTabs} />}</Drawer.Screen>
  </Drawer.Navigator>
);

export default DrawerNavigator;
