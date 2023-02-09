import '@testing-library/jest-native/extend-expect';

import App from './App';
import React from 'react';
import { render } from '@testing-library/react-native';

test('renders correctly', () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId('heading')).toHaveTextContent('Welcome');
});
