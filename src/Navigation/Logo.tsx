import React from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="Logo-Link">
      <img
        alt="Simple Budget Logo"
        className="Logo"
        src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/money-circle-green-3-512.png"
      />
      <h2>Simple Budget</h2>
    </Link>
  );
};

export default Logo;
