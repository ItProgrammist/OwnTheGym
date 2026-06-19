/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styles from './scss/StatisticsPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface HistoryItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  date: string;
  imageUrl: string;
}

export const StatisticsPage: React.FC = () => {
  // Статистические счетчики сверху
  const stats = {
    workoutsCount: 4,
    challengesCount: 1
  };

  // Лента выполненных тренировок из истории
  const historyLog: HistoryItem[] = [
    {
      id: 'log-1',
      title: 'Chest Mission',
      difficulty: 'Hard',
      date: '17.06.2026, 23:17',
      imageUrl: 'https://unsplash.com',
    },
    {
      id: 'log-2',
      title: 'Arms Killer',
      difficulty: 'Medium',
      date: '15.06.2026, 20:35',
      imageUrl: 'https://unsplash.com',
    },
    {
      id: 'log-3',
      title: 'Leg Armageddon',
      difficulty: 'Insane',
      date: '14.06.2026, 22:11',
      imageUrl: 'https://unsplash.com',
    },
  ];

  const getDifficultyClass = (diff: 'Easy' | 'Medium' | 'Hard' | 'Insane') => {
    if (diff === 'Medium') return styles['history-row__difficulty--medium'];
    if (diff === 'Hard') return styles['history-row__difficulty--hard'];
    return styles['history-row__difficulty--insane'];
  };

  return (
    <div className={styles['stats-page']}>
      <div className={styles['stats-page__content']}>
        
        {/* Кликабельный глобальный логотип */}
        <Header />

        {/* Заголовок секции статистики с линком справа */}
        <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
          <div className="col-auto">
            <h2 className={styles['stats-page__title']}>Statistics</h2>
          </div>
          <div className="col-auto">
            <button className={styles['stats-page__records-btn']}>
              All Records
            </button>
          </div>
        </div>

        {/* Секция счетчиков-индикаторов выполненной активности */}
        <div className="row g-0 justify-content-center text-center mb-4">
          {/* Блок Workouts */}
          <div className="col-5 col-sm-4 d-flex flex-column align-items-center">
            <span className={styles['stats-page__counter-label']}>Workouts</span>
            <span className={styles['stats-page__counter-value']}>{stats.workoutsCount}</span>
          </div>

          {/* Блок Challenges */}
          <div className="col-5 col-sm-4 d-flex flex-column align-items-center">
            <span className={styles['stats-page__counter-label']}>Challenges</span>
            <span className={styles['stats-page__counter-value']}>{stats.challengesCount}</span>
          </div>
        </div>

        {/* Список завершенных тренировок (Лог истории) */}
        <div className="d-flex flex-column gap-3">
          {historyLog.map((log) => (
            <div key={log.id} className={styles['history-row']}>
              <div className="row g-0 align-items-center w-full h-100">
                
                {/* Изображение тренировки */}
                <div className="col-auto h-100">
                  <div className={styles['history-row__image-wrapper']}>
                    <img src={log.imageUrl} alt={log.title} />
                  </div>
                </div>

                {/* Основное инфо: Название + Сложность */}
                <div className="col ps-3 d-flex flex-column justify-content-center">
                  <h3 className={styles['history-row__title']}>{log.title}</h3>
                  <p className={styles['history-row__difficulty-label']}>
                    Difficulty:{' '}
                    <span className={getDifficultyClass(log.difficulty)}>
                      {log.difficulty}
                    </span>
                  </p>
                </div>

                {/* Штамп даты и времени завершения справа */}
                <div className="col-auto pe-3 align-self-end pb-3">
                  <span className={styles['history-row__date']}>
                    {log.date}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Глобальный интерактивный таб-бар */}
      <Footer />
    </div>
  );
};
