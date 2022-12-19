import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { GestureResponderEvent, TextStyle, TouchableWithoutFeedback } from 'react-native'
import { Ripple } from '../Ripple'

export function MenuIcon(props: { onPress: (event: GestureResponderEvent) => void; style: TextStyle }) {
    return (
        <Ripple
            onPress={props.onPress}
            size={100}
            duration={300}
            style={{ paddingVertical: 5, paddingHorizontal: 6, marginLeft: 5 }}
        >
            <Ionicons name="menu" size={30} style={props.style} />
        </Ripple>
    )
}
