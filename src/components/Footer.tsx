/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './scss/Footer.module.scss';

export const Footer: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={styles['main-page']}>
      {/* Нижняя навигационная панель */}
      <footer className={styles['bottom-nav']}>
        <div className={styles['bottom-nav__container']}>
          
          {/* Гантель -> Ведет на главную страницу "/" */}
          <Link 
            to="/workouts" 
            className={`${styles['bottom-nav__button']} ${styles['bottom-nav__button--dumbbell']} ${isActive('/') ? styles['active'] : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6.5 6.5 11 11" /><path d="m21 21-1-1" /><path d="m3 3 1 1" /><path d="m18.5 5.5 3 3-2.5 2.5-3-3Z" /><path d="m5.5 18.5 3 3-2.5 2.5-3-3Z" />
            </svg>
          </Link>

          {/* Список задач -> Ведет на страницу тренировок "/workouts" */}
          <Link 
            to="/exercises" 
            className={`${styles['bottom-nav__button']} ${styles['bottom-nav__button--todo']} ${isActive('/workouts') ? styles['active'] : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="6" height="6" rx="1" /><path d="m3 17 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" />
            </svg>
          </Link>

          <Link 
            to="/challenges" 
            className={`${styles['bottom-nav__button']} ${styles['bottom-nav__button--trophy']} ${isActive('/achievements') ? styles['active'] : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" /><path d="M12 2a6 6 0 0 1 6 6v1c0 2.2-1.8 4-4 4h-4a4 4 0 0 1-4-4V8a6 6 0 0 1 6-6z" />
            </svg>
          </Link>

          <Link 
            to="/statistics" 
            className={`${styles['bottom-nav__button']} ${styles['bottom-nav__button--trends']} ${isActive('/stats') ? styles['active'] : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
            </svg>
          </Link>

        </div>
      </footer>
    </div>
  );
};
