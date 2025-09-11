import React from 'react';
import { createRoot } from 'react-dom/client';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signin from './Signin';
import TokenService from '../token-service';

// Mock the TokenService
jest.mock('../token-service', () => ({
  saveAuthToken: jest.fn(),
  makeBasicAuthToken: jest.fn(() => 'mock-token'),
  saveUserId: jest.fn(),
}));

// Mock the config
jest.mock('../config', () => ({
  API_ENDPOINT: 'https://web-production-a960.up.railway.app',
}));

// Mock react-promise-tracker
jest.mock('react-promise-tracker', () => ({
  trackPromise: jest.fn((promise) => promise),
}));

// Mock fetch
global.fetch = jest.fn();

const mockProps = {
  setDemo: jest.fn(),
  loadUser: jest.fn(),
  onRouteChange: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<Signin {...mockProps} />);
  root.unmount();
});

it('handles demo signin with correct credentials', async () => {
  // Mock successful API response
  const mockUser = { id: '123', email: 'demo@gmail.com' };
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockUser,
  });

  render(<Signin {...mockProps} />);

  // Find and click the demo signin button
  const demoButton = screen.getByText('Use Demo Account');
  fireEvent.click(demoButton);

  // Wait for the async operations to complete
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('https://web-production-a960.up.railway.app/signin', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo@gmail.com',
        password: 'password123456',
      }),
    });
  });

  // Verify TokenService methods were called
  expect(TokenService.makeBasicAuthToken).toHaveBeenCalledWith('demo@gmail.com', 'password123456');
  expect(TokenService.saveAuthToken).toHaveBeenCalled();
  expect(TokenService.saveUserId).toHaveBeenCalledWith('123');

  // Verify navigation and demo state
  expect(mockProps.onRouteChange).toHaveBeenCalledWith('home');
  expect(mockProps.setDemo).toHaveBeenCalledWith(true);
});

it.skip('handles demo signin API error', async () => {
  // Mock API error response
  const mockError = { error: 'Invalid credentials' };
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => mockError,
  });

  // Mock console.error to prevent error from being logged during test
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(<Signin {...mockProps} />);

  // Find and click the demo signin button
  const demoButton = screen.getByText('Use Demo Account');
  fireEvent.click(demoButton);

  // Wait for the async operations to complete
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('https://web-production-a960.up.railway.app/signin', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo@gmail.com',
        password: 'password123456',
      }),
    });
  });

  // Verify TokenService methods were still called (token is saved before API call)
  expect(TokenService.makeBasicAuthToken).toHaveBeenCalledWith('demo@gmail.com', 'password123456');
  expect(TokenService.saveAuthToken).toHaveBeenCalled();

  // Verify navigation and demo state are NOT called on error
  expect(mockProps.onRouteChange).not.toHaveBeenCalled();
  expect(mockProps.setDemo).not.toHaveBeenCalled();
  expect(TokenService.saveUserId).not.toHaveBeenCalled();

  // Restore console.error
  consoleSpy.mockRestore();
});
