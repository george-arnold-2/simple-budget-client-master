import React from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';
import Logo from './Logo';

interface NavigationProps {
  signedIn: boolean;
  route: string;
  onRouteChange: (route: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ signedIn, route, onRouteChange }) => {
  if (signedIn) {
    return (
      <nav className="Navigation">
        <Logo />
        <div className="Navigation-Links">
          <button onClick={() => onRouteChange('home')} className="Button">
            <Link className="Logout-Link" to="/">
              Add Transactions
            </Link>
          </button>
          <button onClick={() => onRouteChange('categories')} className="Button">
            <Link className="Logout-Link" to="/categories">
              Manage Categories
            </Link>
          </button>
          <button onClick={() => onRouteChange('track')} className="Button">
            <Link className="Logout-Link" to="/track">
              Spending Tracker
            </Link>
          </button>
          <button onClick={() => onRouteChange('signout')} className="Button">
            <Link className="Logout-Link" to="/">
              Logout
            </Link>
          </button>
        </div>
      </nav>
    );
  } else if (route === 'signup') {
    return (
      <nav className="Navigation">
        <Logo />
        <button onClick={() => onRouteChange('register')} className="Button">
          Register
        </button>
      </nav>
    );
  } else {
    return (
      <nav className="Navigation">
        <Logo />
        <button onClick={() => onRouteChange('signup')} className="Button">
          Sign in
        </button>
      </nav>
    );
  }
};

export default Navigation;
