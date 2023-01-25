import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';
import React from 'react';

import { TabOptions } from '../../types';
import { PrimaryText } from '../PrimaryText';
import { BottomBar } from './BottomBar';
import { MenuIcon } from './MenuIcon';

const screenOptions = ({ navigation }: DrawerScreenProps<ParamListBase>): BottomTabNavigationOptions => {
  const state = navigation.getState();

  return {
    headerStyle: {
      backgroundColor: 'black',
    },
    headerLeft: () => <MenuIcon onPress={() => navigation.toggleDrawer()} style={{ color: 'white' }} />,
    headerTitle: (props) => (
      <PrimaryText {...props} style={{ color: 'white', fontSize: 22 }} weight="semiBold">
        {state.routeNames[state.index]}
      </PrimaryText>
    ),
  };
};

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = (props: { tabs: TabOptions[] }) => (
  <Tab.Navigator tabBar={(props) => <BottomBar {...props} />} screenOptions={screenOptions}>
    {props.tabs.map((tab) => (
      <Tab.Screen
        key={tab.name}
        name={tab.name}
        component={tab.component}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            tab.icon({
              color,
              size: tab.size ?? size,
              name: (focused ? tab.iconActive : tab.iconInactive) as keyof typeof tab.icon,
            }),
        }}
      />
    ))}
  </Tab.Navigator>
);
