import { typography } from '../constants/theme/typography'
import React from 'react'
import { Text } from 'react-native'
import type { TextStyle } from 'react-native';
import type { FontWeightsPrimary} from '../constants/theme/typography';


export const PrimaryText = (props: { children: React.ReactNode; style: TextStyle; weight: FontWeightsPrimary }) => (
    <Text style={[{ fontFamily: typography.primary[props.weight] ?? typography.primary.normal }, props.style]}>
        {props.children}
    </Text>
)
