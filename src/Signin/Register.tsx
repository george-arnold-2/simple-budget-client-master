import React, { useState } from 'react';
import './Signin.css';
import config from '../config';
import TokenService from '../token-service';

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
);

interface FormErrors {
  email: string;
  password: string;
}

interface RegisterProps {
  loadUser: () => void;
  onRouteChange: (route: string) => void;
  setDemo: (value: boolean) => void;
}

const validateForm = (errors: FormErrors): boolean => {
  let valid = true;
  Object.values(errors).forEach(
    // if we have an error string set valid to false
    (val) => val.length > 0 && (valid = false),
  );
  return valid;
};

const Register: React.FC<RegisterProps> = ({ loadUser, onRouteChange, setDemo }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
  });

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    let message = '';
    const { value } = event.target;
    if (!validEmailRegex.test(value)) {
      message = '--Email is not valid';
    }
    setEmail(value);
    setErrors((prevState) => ({
      ...prevState,
      email: message,
    }));
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    let passwordError = '';
    const { value } = event.target;
    if (value.length < 8) {
      passwordError = '--Password must be at least 8 characters';
    }
    setPassword(value);
    setErrors((prevState) => ({
      ...prevState,
      password: passwordError,
    }));
  };

  const handleDemo = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    const email = 'demo@gmail.com';
    const password = 'password123456';
    TokenService.saveAuthToken(TokenService.makeBasicAuthToken(email, password));
    const signIn = {
      email: email,
      password: password,
    };
    fetch(`${config.API_ENDPOINT}/signin`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(signIn),
    })
      .then((res) => (!res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()))
      .then((user) => {
        if (user.id) {
          onRouteChange('home');
          setDemo(true);
        }
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!validateForm(errors) || !(email && password)) {
      alert('Error: please complete the form' + errors.email + ' ' + errors.password);
    } else {
      const token = TokenService.makeBasicAuthToken(email, password);
      TokenService.saveAuthToken(token);
      const register = {
        email: email,
        password: password,
      };
      fetch(`${config.API_ENDPOINT}/register`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(register),
      })
        .then((response) => response.json())
        .then((user) => {
          if (user) {
            // loadUser(user);
            onRouteChange('home');
          }
        });
    }
  };

  return (
    <div className="Landing-Page">
      <section className="Create-Account">
        <h2>Create Account</h2>
        <form className="Login-Forms">
          <input
            onClick={handleDemo}
            className="Submit"
            id="submit-demo"
            name="submit-demo"
            type="submit"
            value="Use Demo Account"
          />
          <label className="Label">Email Address</label>
          <input
            className="Sign-Up-Input"
            type="email"
            id="register-email"
            name="register-email"
            value={email}
            onChange={handleEmail}
          />
          {errors.email.length > 0 && <span className="error">{errors.email}</span>}

          <label className="Label">Password</label>
          <input
            type="password"
            id="register-password"
            name="register-password"
            className="Sign-Up-Input"
            value={password}
            onChange={handlePassword}
          />
          {errors.password.length > 0 && <span className="error">{errors.password}</span>}

          <input onClick={handleSubmit} className="Submit" type="submit" value="submit" />
        </form>
        <p className="Register" onClick={() => onRouteChange('signin')}>
          Already have an account? Sign in
        </p>
      </section>
    </div>
  );
};

export default Register;
