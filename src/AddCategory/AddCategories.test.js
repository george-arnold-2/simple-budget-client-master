import React from 'react';
import { createRoot } from 'react-dom/client';
import AddCategories from './AddCategories';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<AddCategories />);
  root.unmount();
});
