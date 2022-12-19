import * as React from 'react'
import { create } from 'react-test-renderer'

import { MonoText } from '../StyledText'

it('renders correctly', () => {
    const tree = create(<MonoText>Snapshot test!</MonoText>).toJSON()
    expect(tree).toMatchSnapshot()
})
