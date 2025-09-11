import React, { useState } from 'react';
import './Signin.css';
import config from '../config';
import TokenService from '../token-service';
import { trackPromise } from 'react-promise-tracker';

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
);

interface FormErrors {
  email: string;
  password: string;
}

interface SigninProps {
  setDemo: (value: boolean) => void;
  loadUser: () => void;
  onRouteChange: (route: string) => void;
}

const validateForm = (errors: FormErrors): boolean => {
  let valid = true;
  Object.values(errors).forEach(
    // if we have an error string set valid to false
    (val) => val.length > 0 && (valid = false),
  );
  return valid;
};

const Signin: React.FC<SigninProps> = ({ setDemo, loadUser, onRouteChange }) => {
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
    trackPromise(
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
            TokenService.saveUserId(user.id);
            onRouteChange('home');
            setDemo(true);
          }
        }),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!validateForm(errors) || !(email && password)) {
      alert('Error: please complete the form' + errors.email + ' ' + errors.password);
    } else {
      const token = TokenService.makeBasicAuthToken(email, password);
      TokenService.saveAuthToken(token);
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
            TokenService.saveUserId(user.id);
            onRouteChange('home');
            setDemo(false);
          }
        })
        .catch((res) => {
          if (res.email) {
            setErrors((prevState) => ({
              ...prevState,
              email: res.email,
            }));
          } else {
            setErrors((prevState) => ({
              ...prevState,
              password: res.password,
            }));
          }
        });
    }
  };

  return (
    <div className="Landing-Page">
      <section className="Create-Account" id="Login-Section">
        <h2>Sign In to Get Started</h2>

        <form className="Login-Forms">
          <input
            onClick={handleDemo}
            className="Submit"
            id="submit-demo"
            name="submit-demo"
            type="submit"
            value="Use Demo Account"
          />
          <label htmlFor="email-address" className="Label">
            email Address
          </label>
          <input
            className="Sign-Up-Input"
            type="email"
            name="email-address"
            id="email-address"
            value={email}
            onChange={handleEmail}
          />
          {errors.email.length > 0 && <span className="error">{errors.email}</span>}

          <label htmlFor="pasword-entry" className="Label">
            Password
          </label>
          <input
            type="password"
            id="password-entry"
            className="Sign-Up-Input"
            value={password}
            onChange={handlePassword}
          />
          {errors.password.length > 0 && <span className="error">{errors.password}</span>}

          <input
            onClick={handleSubmit}
            className="Submit"
            id="submit-signin"
            name="submit-signin"
            type="submit"
            value="submit"
          />
        </form>
        <p className="Register" onClick={() => onRouteChange('register')}>
          Click to create an account?{' '}
        </p>
      </section>
    </div>
  );
};

export default Signin;
