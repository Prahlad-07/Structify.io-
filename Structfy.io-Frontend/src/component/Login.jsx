import React, { useState } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import '../css/login.scss';

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState('logIn');
  const [passAlert, setPassAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginModel, setLoginModel] = useState({ mail: '', password: '' });
  const [registerModel, setRegisterModel] = useState({
    mail: '',
    password: '',
    repassword: '',
    name: '',
    surname: ''
  });
  const [response, setResponse] = useState({ success: null, message: '' });

  const clearFeedback = () => {
    setPassAlert('');
    setResponse({ success: null, message: '' });
  };

  const changeView = (nextView) => {
    setView(nextView);
    setLoginModel({ mail: '', password: '' });
    setRegisterModel({ mail: '', password: '', repassword: '', name: '', surname: '' });
    clearFeedback();
  };

  const isLoginValid = () => loginModel.mail.trim() && loginModel.password.trim();
  const isEmailValid = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  const isRegisterValid = () =>
    registerModel.mail.trim() &&
    isEmailValid(registerModel.mail.trim()) &&
    registerModel.name.trim() &&
    registerModel.surname.trim() &&
    registerModel.password.length >= 8 &&
    registerModel.password === registerModel.repassword;

  const getFeedbackClass = () => {
    if (!response.message) {
      return '';
    }
    return response.success ? 'is-success' : 'is-error';
  };

  const handleLoginField = (e) => {
    const { id, value } = e.target;
    setLoginModel((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegisterField = (e) => {
    const { id, value } = e.target;
    setRegisterModel((prev) => {
      const updated = { ...prev, [id]: value };
      if (updated.password && updated.repassword && updated.password !== updated.repassword) {
        setPassAlert('Passwords do not match');
      } else {
        setPassAlert('');
      }
      return updated;
    });
  };

  const login = async (e) => {
    e.preventDefault();
    clearFeedback();
    if (isLoginValid()) {
      setIsSubmitting(true);
      try {
        const res = await UserService.login(loginModel.mail.trim(), loginModel.password);
        setResponse(res);

        if (res && res.success === true) {
          setTimeout(() => {
            navigate('/courseMain', { state: true });
          }, 1500);
        }
      } catch (error) {
        console.error('Login error:', error);
        setResponse({
          success: false,
          message: error?.message || 'Unable to sign in right now. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setResponse({ success: false, message: 'Please enter a valid email and password.' });
    }
  };

  const register = async (e) => {
    e.preventDefault();
    clearFeedback();
    if (isRegisterValid()) {
      setIsSubmitting(true);
      try {
        const res = await UserService.register(
          registerModel.name,
          registerModel.surname,
          registerModel.mail,
          registerModel.password
        );
        setResponse(res);

        if (res && res.success === true) {
          setTimeout(() => {
            changeView('logIn');
            setResponse({ success: true, message: 'Registration successful. Please login.' });
          }, 1500);
        }
      } catch (error) {
        console.error('Register error:', error);
        setResponse({
          success: false,
          message: error?.message || 'Unable to register right now. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setResponse({
        success: false,
        message: 'Please complete all fields with a valid email and matching passwords.'
      });
    }
  };

  return (
    <section id="entry-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <h1>Structify</h1>
          <p>Learn data structures with interactive visuals and guided exams.</p>
          <button type="button" className="ghost-action" onClick={() => navigate('/freespace')}>
            Explore Free Space
          </button>
        </div>

        {view === 'signUp' ? (
          <form className="auth-form" onSubmit={register}>
            <h2>Create Account</h2>
            <fieldset>
              <legend>Sign Up</legend>
              <ul>
                <li>
                  <label htmlFor="mail">Email</label>
                  <input
                    id="mail"
                    value={registerModel.mail}
                    onChange={handleRegisterField}
                    type="email"
                    maxLength={50}
                    required
                  />
                </li>
                <li>
                  <label htmlFor="name">First Name</label>
                  <input
                    id="name"
                    value={registerModel.name}
                    onChange={handleRegisterField}
                    type="text"
                    maxLength={40}
                    required
                  />
                </li>
                <li>
                  <label htmlFor="surname">Last Name</label>
                  <input
                    id="surname"
                    value={registerModel.surname}
                    onChange={handleRegisterField}
                    type="text"
                    maxLength={40}
                    required
                  />
                </li>
                <li>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    value={registerModel.password}
                    onChange={handleRegisterField}
                    type="password"
                    minLength={8}
                    maxLength={40}
                    required
                  />
                </li>
                <li>
                  <label htmlFor="repassword">Confirm</label>
                  <input
                    id="repassword"
                    value={registerModel.repassword}
                    onChange={handleRegisterField}
                    type="password"
                    maxLength={40}
                    required
                  />
                </li>
              </ul>
            </fieldset>

            {passAlert ? <p className="form-feedback is-error">{passAlert}</p> : null}
            {response.message ? <p className={`form-feedback ${getFeedbackClass()}`}>{response.message}</p> : null}

            <button id="registerBtn" type="submit" disabled={!isRegisterValid() || isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
            <button type="button" className="secondary-action" onClick={() => changeView('logIn')}>
              Have an account? Login
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={login}>
            <h2>Welcome Back</h2>
            <fieldset>
              <legend>Login</legend>
              <ul>
                <li>
                  <label htmlFor="mail">Email</label>
                  <input
                    id="mail"
                    value={loginModel.mail}
                    onChange={handleLoginField}
                    type="email"
                    maxLength={50}
                    required
                  />
                </li>
                <li>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    value={loginModel.password}
                    onChange={handleLoginField}
                    type="password"
                    required
                  />
                </li>
              </ul>
            </fieldset>

            {response.message ? <p className={`form-feedback ${getFeedbackClass()}`}>{response.message}</p> : null}

            <button id="loginBtn" type="submit" disabled={!isLoginValid() || isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
            <button type="button" className="secondary-action" onClick={() => changeView('signUp')}>
              Create Account
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
