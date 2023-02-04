import App from './App';
import * as React from 'react';
import { render } from '@testing-library/react-native';


test('renders correctly', () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId('heading')).toHaveTextContent('Welcome');
});
