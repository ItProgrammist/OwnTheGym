/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './scss/Header.module.scss';

interface HeaderProps {
  hideAuth?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ hideAuth = false }) => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('ownthegym_username');
  });

  const handleLogout = () => {
    localStorage.removeItem('ownthegym_username');
    setUsername(null);
    navigate('/login');
  };

  // Формируем динамический класс: если hideAuth активен, отключаем нижнюю рамку
  const headerClassName = `${styles['header']} ${hideAuth ? styles['header--no-border'] : ''}`;

  return (
    <header className={headerClassName}>
      <div className="position-relative d-flex align-items-center justify-content-center w-100 h-100">
        
        {/* ЛОГОТИП СТРОГО ПО ЦЕНТРУ */}
        <div className="text-center">
          <Link to="/" className={styles['header__logo-link']}>
            <h1 className={styles['header__logo']}>
              OWN<span>THE</span>GYM
            </h1>
          </Link>
        </div>

        {/* БЛОК АВТОРИЗАЦИИ: скрывается, если hideAuth={true} */}
        {!hideAuth && (
          <div className={styles['header__auth-wrapper']}>
            {username ? (
              <div className={styles['header__user-block']} onClick={handleLogout} title="Click to Logout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="me-2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className={styles['header__username']}>{username}</span>
              </div>
            ) : (
              <button 
                className={styles['header__auth-btn']} 
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
