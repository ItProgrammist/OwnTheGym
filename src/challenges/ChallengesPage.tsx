/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Импортируем Link и useNavigate
import styles from './scss/ChallengesPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface ChallengeItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  imageUrl: string;
}

export const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();

  // Список доступных челленджей
  const [challenges, setChallenges] = useState<ChallengeItem[]>([
    {
      id: 'chest-domination',
      title: 'CHEST DOMINATION',
      difficulty: 'Hard',
      imageUrl: 'https://unsplash.com',
    },
    {
      id: 'arm-war-challenge',
      title: 'ARM WAR Challenge',
      difficulty: 'Medium',
      imageUrl: 'https://unsplash.com',
    },
    {
      id: 'leg-samson-challenge',
      title: 'LEG SAMSON Challenge',
      difficulty: 'Insane',
      imageUrl: 'https://unsplash.com',
    },
  ]);

  const getDifficultyClass = (diff: 'Easy' | 'Medium' | 'Hard' | 'Insane') => {
    if (diff === 'Medium') return styles['challenge-row__difficulty--medium'];
    if (diff === 'Hard') return styles['challenge-row__difficulty--hard'];
    return styles['challenge-row__difficulty--insane'];
  };

  const handleAddChallenge = () => {
    console.log('Добавление нового испытания');
  };

  const handleDeleteChallenge = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // Изолируем клик от внешнего Link
    setChallenges((prev) => prev.filter((item) => item.id !== id));
  };

  // ИСПРАВЛЕНО: Теперь функция принимает весь объект challenge, а не только id
  const handleEditChallenge = (e: React.MouseEvent, challenge: ChallengeItem) => {
    e.preventDefault();
    e.stopPropagation(); // Изолируем клик от перехода по большой плашке

    // Явно передаем пару ключ-значение "challenge: challenge" в state истории роутера
    navigate(`/challenges/${challenge.id}/edit`, { state: { challenge: challenge } });
  };


  return (
    <div className={styles['challenges-page']}>
      <div className={styles['challenges-page__content']}>

        {/* Кликабельный верхний логотип */}
        <Header />

        {/* Панель навигации: Заголовок секции + Кнопка Add */}
        <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
          <div className="col-auto">
            <h2 className={styles['challenges-page__title']}>Challenges</h2>
          </div>
          <div className="col-auto">
            {/* ИСПРАВЛЕНО: Кнопка вызывает переход на роут создания нового челленджа без передачи state */}
            <button
              className={styles['challenges-page__add-btn']}
              onClick={() => navigate('/challenges/new/edit')}
            >
              <svg viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Add
            </button>
          </div>
        </div>

        {/* Список плашек челленджей */}
        <div className="d-flex flex-column gap-3">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={styles['challenge-row-link']}
              /* ИСПРАВЛЕНО: При клике на саму строку переходим и передаем объект в state */
              onClick={() => navigate(`/challenges/${challenge.id}`, { state: { challenge: challenge } })}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles['challenge-row']}>
                <div className="row g-0 align-items-center w-full h-100">

                  {/* Превью-изображение испытания */}
                  <div className="col-auto h-100">
                    <div className={styles['challenge-row__image-wrapper']}>
                      <img src={challenge.imageUrl} alt={challenge.title} />
                    </div>
                  </div>

                  {/* Инфо */}
                  <div className="col ps-3 d-flex flex-column justify-content-center">
                    <h3 className={styles['challenge-row__title']}>{challenge.title}</h3>
                    <p className={styles['challenge-row__difficulty-label']}>
                      Difficulty:{' '}
                      <span className={getDifficultyClass(challenge.difficulty)}>
                        {challenge.difficulty}
                      </span>
                    </p>
                  </div>

                  {/* Кнопки управления справа */}
                  <div className="col-auto pe-3 d-flex align-items-center gap-2">
                    <button
                      className={styles['challenge-row__action-btn']}
                      onClick={(e) => handleDeleteChallenge(e, challenge.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                        <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>

                    {/* Кнопка редактирования челленджа (синий карандаш) */}
                    <button
                      className={styles['challenge-row__action-btn']}
                      /* ИСПРАВЛЕНО: Передаем в handleEditChallenge весь текущий объект итерации */
                      onClick={(e) => handleEditChallenge(e, challenge)}
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="20" height="20" rx="4" fill="#1d4ed8" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1.5" />
                        <path d="M7 17l2.5.5L17 10l-3-3-7.5 7.5L7 17zM13 8l3 3" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* Глобальный таб-бар */}
      <Footer />
    </div>
  );
};
