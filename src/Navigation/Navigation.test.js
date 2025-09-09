import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>,
  );
  root.unmount();
});
