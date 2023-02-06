import { PrimaryText } from '../PrimaryText';
import { Ripple } from '../Ripple';
import React from 'react';
import { View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';


export function BottomBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  return (
    <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel === undefined
            ? options.title === undefined
              ? route.name
              : options.title
            : options.tabBarLabel;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const color = isFocused ? 'white' : 'gray';
        return (
          <Ripple
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
            size={150}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 7,
            }}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
          >
            <View>{options.tabBarIcon?.({ focused: isFocused, color, size: 30 })}</View>
            <PrimaryText style={{ color, fontSize: 13 }} weight={isFocused ? 'semiBold' : 'medium'}>
              {typeof label === 'string'
                ? label
                : label({
                    focused: isFocused,
                    color,
                    position: 'below-icon',
                    children: '',
                  })}
            </PrimaryText>
          </Ripple>
        );
      })}
    </View>
  );
}
