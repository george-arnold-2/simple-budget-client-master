import React from 'react';
import { createRoot } from 'react-dom/client';
import Signin from './Signin';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<Signin />);
  root.unmount();
});
