/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './scss/AuthPages.module.scss';
import { Header } from '../components/Header';
import { api, type LoginRegisterResponse } from '../api/authService';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. ВАЛИДАЦИЯ: Проверка длины пароля
    if (password.length < 8) {
      setError('Пароль слишком короткий. Он должен содержать не менее 8 символов.');
      return;
    }

    if (password !== passwordAgain) {
      setError('Пароли не совпадают. Пожалуйста, введите их повторно.');
      return;
    }

    try {
      const response = await api.post<LoginRegisterResponse>('/auth/register', {
        username: username.trim(),
        email: email.trim(),
        password
      });

      const token = response.data?.accessToken;
      const registeredName = response.data?.user?.username;
      
      if (token) {
        localStorage.setItem('ownthegym_token', token);
        localStorage.setItem('ownthegym_username', registeredName || username.trim());
        navigate('/');
      } else {
        setError('Сервер не вернул токен доступа. Попробуйте войти вручную.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverData = err.response?.data as { message?: string | string[]; error?: string };
        if (err.response?.status === 409) {
          setError('Пользователь с таким Email или Логином уже зарегистрирован.');
        } else if (serverData?.message) {
          const errorDetails = Array.isArray(serverData.message) ? serverData.message.join('. ') : serverData.message;
          setError(`Ошибка регистрации: ${errorDetails}`);
        } else {
          setError('Не удалось завершить регистрацию. Ошибка сервера.');
        }
      } else {
        setError('Произошла непредвиденная ошибка.');
      }
    }
  };

  return (
    <div className={styles['auth-page']}>
      <div className={styles['auth-page__header-wrapper']}>
        <Header hideAuth={true} />
      </div>
      <div className={styles['auth-page__container']}>
        <form onSubmit={handleRegisterSubmit} className="d-flex flex-column gap-3 w-100">
          <h2 className={styles['auth-page__title']}>Sign Up</h2>
          {error && <div className="alert alert-danger py-2 small mb-0">{error}</div>}
          <div className="position-relative">
            <input type="text" placeholder="Username..." value={username} onChange={(e) => setUsername(e.target.value)} className={styles['auth-input']} required />
            <span className={styles['auth-input__icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </span>
          </div>
          <div className="position-relative">
            <input type="email" placeholder="Email address..." value={email} onChange={(e) => setEmail(e.target.value)} className={styles['auth-input']} required />
            <span className={styles['auth-input__icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            </span>
          </div>
          <div className="position-relative">
            <input type="password" placeholder="Create password..." value={password} onChange={(e) => setPassword(e.target.value)} className={styles['auth-input']} required />
            <span className={styles['auth-input__icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </span>
          </div>
          <div className="position-relative">
            <input type="password" placeholder="Password again..." value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} className={styles['auth-input']} required />
            <span className={styles['auth-input__icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </span>
          </div>
          <button type="submit" className={styles['auth-submit-btn']}>Create Account</button>
        </form>
        <div className={styles['auth-page__switch-text']}>
          Already have an account? <span onClick={() => navigate('/login')}>Sign In</span>
        </div>
      </div>
    </div>
  );
};
