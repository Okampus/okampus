import { MonoText } from '../StyledText';

import React from 'react';
import renderer from 'react-test-renderer';

it(`renders correctly`, () => {
  const tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();
  expect(tree).toMatchSnapshot();
});
