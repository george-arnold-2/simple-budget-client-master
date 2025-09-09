import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { usePromiseTracker } from 'react-promise-tracker';
import { ThreeDots } from 'react-loader-spinner';

const LoadingIndicator: React.FC = () => {
  const { promiseInProgress } = usePromiseTracker();
  return promiseInProgress ? (
    <div
      style={{
        width: '100%',
        height: '100',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ThreeDots color="#000000" height="100" width="100" />
    </div>
  ) : null;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <LoadingIndicator />
    <App />
  </BrowserRouter>,
);
