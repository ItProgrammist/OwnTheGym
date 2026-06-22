/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './scss/Header.module.scss';

interface HeaderProps {
  hideAuth?: boolean;
}

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('ownthegym_username'));

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('ownthegym_token');
    localStorage.removeItem('ownthegym_username');
    setUsername(null);
    navigate('/login');
  };

  return (
    <header className={styles['header']}>
      <div className="position-relative d-flex align-items-center justify-content-center w-100 h-100">
        
        <div className="text-center">
          <Link to="/" className={styles['header__logo-link']}>
            <h1 className={styles['header__logo']}>OWN<span>THE</span>GYM</h1>
          </Link>
        </div>

        <div className={styles['header__auth-wrapper']}>
          {username ? (
            <div className="d-flex align-items-center gap-3">
              {/* Клик по имени ведет на страницу статистики */}
              <div className={styles['header__user-block']} onClick={() => navigate('/statistics')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="me-2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <span className={styles['header__username']}>{username}</span>
              </div>
              {/* Отдельная кнопка Выйти */}
              <button className={styles['header__logout-btn']} onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <button className={styles['header__auth-btn']} onClick={() => navigate('/login')}>
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
