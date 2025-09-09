import React from 'react';
import { createRoot } from 'react-dom/client';
import Categories from './Categories';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<Categories />);
  root.unmount();
});
