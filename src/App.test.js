import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders song list', () => {
  const { getByText } = render(<App />);
  const dreamSong = getByText(/Dream/i);
  expect(dreamSong).toBeInTheDocument();
});
