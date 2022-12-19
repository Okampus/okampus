import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer'
import { DrawerNavigationState } from '@react-navigation/native'
import { styled } from 'nativewind'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { inspect } from 'util'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledDrawerItemList = styled(DrawerItemList)

const drawerItemSize = 50
const marginHorizontal = 8

const itemStyle = {
    height: drawerItemSize,
    width: drawerItemSize,
    backgroundColor: '#A8A8A8',
    marginHorizontal,
    marginBottom: 5,
    marginTop: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
}

export function Sidebar(props: DrawerContentComponentProps) {
    const { state, navigation } = props
    const { routes, index } = state

    const focusedRoute = routes[index].name

    return (
        <SafeAreaView style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ width: drawerItemSize + 2 * marginHorizontal, backgroundColor: '#383838', paddingTop: 7 }}>
                {/* <Text>
                    {inspect(props.state)}
                </Text> */}
                <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }} style={{ width: '100%' }}>
                    {routes.map((route) => (
                        <Pressable
                            {...props}
                            key={route.key}
                            style={
                                focusedRoute === route.name
                                    ? { ...itemStyle, borderRadius: 15 }
                                    : { ...itemStyle, borderRadius: 25 }
                            }
                            onPress={() => {
                                navigation.navigate(route.name)
                            }}
                        />
                    ))}
                    {/* <DrawerItemList {...props} itemStyle={itemStyle} /> */}
                    {/* <View style={{ backgroundColor: 'black' }}>
                        {
                            [...new Array(20)].map((_, idx) => <DrawerItem
                                
                                key={idx}
                                label={''}
                                // label="FirstPage"
                                // style={{
                                //     backgroundColor: "green",
                                //     width: 50,
                                //     height: 50,
                                // }}
                                // labelStyle={{ color: 'white', fontSize: 20, width: "50px" }}
                                // onPress={() => {
                                //     props.navigation.navigate('FirstPage');
                                // }}
                            />)
                        }
                    </View> */}
                </DrawerContentScrollView>
            </View>
            <View style={{ flexGrow: 1 }}>
                <Text>Notifications</Text>
                <ScrollView>
                    {[...new Array(100)].map((_, idx) => (
                        <View style={{}} key={`Yo ${idx}`}>
                            <Text style={{ color: 'black' }}>Notification {idx}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
        // <View>
        // <DrawerContentScrollView {...props}>
        //     <StyledView className="flex flex-row">
        //         <Text style={{ color: 'red' }}>Test</Text>
        //         <StyledDrawerItemList className="w-12" {...props} />
        //     </StyledView>
        // </DrawerContentScrollView>
        //     {/* <Text>Test</Text>
        // </View> */}
    )
}
