/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './scss/AuthPages.module.scss';
import { Header } from '../components/Header';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordAgain) {
      alert('Passwords do not match!');
      return;
    }
    localStorage.setItem('ownthegym_username', username);
    navigate('/');
  };

  return (
    <div className={styles['auth-page']}>
      
      {/* Контейнер хедера над формой */}
      <div className={styles['auth-page__header-wrapper']}>
        <Header hideAuth={true} />
      </div>

      {/* Контейнер формы */}
      <div className={styles['auth-page__container']}>
        <form onSubmit={handleRegisterSubmit} className="d-flex flex-column gap-3 w-100">
          <h2 className={styles['auth-page__title']}>Sign Up</h2>

          <div className="position-relative">
            <input
              type="text"
              placeholder="Username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles['auth-input']}
              required
            />
            <span className={styles['auth-input__icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
          </div>

          <div className="position-relative">
            <input
              type="password"
              placeholder="Create password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles['auth-input']}
              required
            />
            <span className={styles['auth-input__icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
          </div>

          <div className="position-relative">
            <input
              type="password"
              placeholder="Password again..."
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              className={styles['auth-input']}
              required
            />
            <span className={styles['auth-input__icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
          </div>

          <button type="submit" className={styles['auth-submit-btn']}>
            Create Account
          </button>
        </form>

        <div className={styles['auth-page__switch-text']}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Sign In</span>
        </div>
      </div>

    </div>
  );
};
