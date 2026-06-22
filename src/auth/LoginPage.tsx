/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './scss/AuthPages.module.scss';
import { Header } from '../components/Header';
import { api, type LoginRegisterResponse } from '../api/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post<LoginRegisterResponse>('/auth/login', {
        email: email.trim(),
        password
      });

      if (response.data?.accessToken) {
        localStorage.setItem('ownthegym_token', response.data.accessToken);

        const meResponse = await api.get('/auth/me');
        localStorage.setItem('ownthegym_username', meResponse.data.username);

        navigate('/');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverData = err.response?.data as { message?: string; error?: string };
        const backendMessage = serverData?.message || serverData?.error;

        if (err.response?.status === 401 || err.response?.status === 404) {
          setError('Неверный Email или пароль. Пожалуйста, проверьте введённые данные.');
        } else if (backendMessage) {
          setError(`Ошибка авторизации: ${backendMessage}`);
        } else {
          setError('Не удалось связаться с сервером. Повторите попытку позже.');
        }
      } else {
        setError('Произошла непредвиденная ошибка при входе.');
      }
    }
  };

  return (
    <div className={styles['auth-page']}>

      {/* Контейнер хедера над формой */}
      <div className={styles['auth-page__header-wrapper']}>
        <Header hideAuth={true} />
      </div>

      {/* Контейнер формы авторизации */}
      <div className={styles['auth-page__container']}>
        <form onSubmit={handleLoginSubmit} className="d-flex flex-column gap-3 w-100">
          <h2 className={styles['auth-page__title']}>Sign In</h2>

          {/* Плашка вывода ошибки валидации бэка */}
          {error && <div className="alert alert-danger py-2 small mb-0">{error}</div>}

          {/* Инпут ввода Email */}
          <div className="position-relative">
            <input
              type="email"
              placeholder="Email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles['auth-input']}
              required
            />
            <span className={styles['auth-input__icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
          </div>

          {/* Инпут ввода Пароля */}
          <div className="position-relative">
            <input
              type="password"
              placeholder="Password..."
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

          <button type="submit" className={styles['auth-submit-btn']}>
            Log In
          </button>
        </form>

        {/* Ссылка на переключение формы */}
        <div className={styles['auth-page__switch-text']}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')}>Sign Up</span>
        </div>
      </div>

    </div>
  );
};
