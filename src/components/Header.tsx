import React from 'react';
import { Link } from 'react-router-dom'; // Импортируем сам компонент Link (без слова type)
import styles from './scss/Header.module.scss';

export const Header: React.FC = () => {
  return (
    /* Ссылка оборачивает весь заголовок и ведет на корень сайта "/" */
    <Link to="/" className={styles['header-link']}>
      <header className={styles['main-page__header']}>
        <h1>
          OWN<span>THEGYM</span>
        </h1>
      </header>
    </Link>
  );
};
