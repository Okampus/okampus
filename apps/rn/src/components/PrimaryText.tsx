import React from 'react'
import { Text, TextStyle } from 'react-native'

import { FontWeightsPrimary, typography } from '../constants/theme/typography'

export const PrimaryText = (props: { children: React.ReactNode; style: TextStyle; weight: FontWeightsPrimary }) => (
    <Text style={[{ fontFamily: typography.primary[props.weight] ?? typography.primary.normal }, props.style]}>
        {props.children}
    </Text>
)
