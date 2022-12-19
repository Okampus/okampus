import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { createDrawerNavigator, DrawerNavigationOptions, DrawerScreenProps } from '@react-navigation/drawer'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import React from 'react'

import { NotFoundScreen } from '../../screens/NotFoundScreen'
import {
    IoniconsGlyphs,
    IoniconsWrapper,
    MaterialCommunityIconsGlyphs,
    MaterialCommunityIconsWrapper,
    RootTabScreenProps,
    TabOptions,
} from '../../shared/types/types'
import { PrimaryText } from '../PrimaryText'
import { BottomTabNavigator } from './BottomTabNavigator'
import { MenuIcon } from './MenuIcon'
import { Sidebar } from './Sidebar'

const Drawer = createDrawerNavigator()

const MaterialCommunityIconWrapper: MaterialCommunityIconsWrapper = ({ name, color, size }) => (
    <MaterialCommunityIcons name={name as MaterialCommunityIconsGlyphs} color={color} size={size} />
)

const IonIconWrapper: IoniconsWrapper = ({ name, color, size }) => (
    <Ionicons name={name as IoniconsGlyphs} color={color} size={size} />
)

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
]

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
]

const DrawerNavigator = () => (
    <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />} screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="General">{(props) => <BottomTabNavigator {...props} tabs={homeTabs} />}</Drawer.Screen>
        <Drawer.Screen name="Manage">{(props) => <BottomTabNavigator {...props} tabs={manageTabs} />}</Drawer.Screen>
    </Drawer.Navigator>
)

export default DrawerNavigator
