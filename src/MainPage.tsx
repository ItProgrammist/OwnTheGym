/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styles from './scss/MainPage.module.scss';
import { Header } from './components/Header';
import { Footer } from './components/Footer'

interface CalendarDay {
  dayName: string;
  dayNumber: number;
  isCompleted: boolean;
}

interface WorkoutCard {
  title: string;
  difficulty: 'Medium' | 'Hard' | 'Insane';
  description: string;
  imageUrl: string;
}

export const MainPage: React.FC = () => {
  const days: CalendarDay[] = [
    { dayName: 'S', dayNumber: 7, isCompleted: false },
    { dayName: 'M', dayNumber: 8, isCompleted: true },
    { dayName: 'T', dayNumber: 9, isCompleted: true },
    { dayName: 'W', dayNumber: 10, isCompleted: false },
    { dayName: 'T', dayNumber: 11, isCompleted: true },
    { dayName: 'F', dayNumber: 12, isCompleted: true },
    { dayName: 'S', dayNumber: 13, isCompleted: false },
  ];

  const workouts: WorkoutCard[] = [
    {
      title: 'Chest Mission',
      difficulty: 'Hard',
      description: 'Includes: Negative, diamond, and controlled push-ups.',
      imageUrl: '../public/placeholder.png',
    },
    {
      title: 'Arms Killer',
      difficulty: 'Medium',
      description: 'Includes: Expander biceps and forearms curls, triceps kickbacks.',
      imageUrl: '../public/placeholder.png',
    },
    {
      title: 'Leg Armageddon',
      difficulty: 'Insane',
      description: 'Includes: Explosive jump squats, power lunges, Bulgarian split squats, wall sits...',
      imageUrl: '../public/placeholder.png',
    },
  ];

  // Метод динамически вытягивает нужный захешированный класс сложности из CSS-модуля
  const getDifficultyClass = (diff: 'Medium' | 'Hard' | 'Insane') => {
    if (diff === 'Medium') return styles['workout-card__difficulty--medium'];
    if (diff === 'Hard') return styles['workout-card__difficulty--hard'];
    return styles['workout-card__difficulty--insane'];
  };

  return (
    <div className={styles['main-page']}>
      <div className={styles['main-page__content']}>

        {/* Логотип */}
        <Header />

        {/* Навигация секции */}
        <div className={styles['main-page__section-nav']}>
          <h2>History</h2>
          <button>All Records</button>
        </div>

        {/* Календарная плашка */}
        {/* <div className={styles['calendar-card']}>
          <div className={styles['calendar-card__grid']}>
            {days.map((day, idx) => (
              <div key={idx} className={styles['calendar-card__day']}>
                <span className={styles['calendar-card__day-name']}>
                  {day.dayName}
                </span>
                <div className={styles['calendar-card__day-value']}>
                  {day.isCompleted ? (
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" fill="white" />
                      <circle cx="12" cy="12" r="9.5" fill="#3b82f6" />
                      <path d="M8.5 12.5l2.5 2.5 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span>{day.dayNumber}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div> */}
        <div className={styles['calendar-card']}>
          {/* Флекс-строка Bootstrap для выстраивания в один ряд */}
          <div className="row g-0 text-center justify-content-between align-items-center">
            {days.map((day, idx) => (
              <div key={idx} className="col d-flex flex-column align-items-center justify-content-center">
                <span className={styles['calendar-card__day-name']}>
                  {day.dayName}
                </span>
                <div className={styles['calendar-card__day-value']}>
                  {day.isCompleted ? (
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" fill="white" />
                      <circle cx="12" cy="12" r="9.5" fill="#3b82f6" />
                      <path d="M8.5 12.5l2.5 2.5 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span>{day.dayNumber}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Сетка карточек тренировок */}
        {/* Заменяем внешний грид на строку Bootstrap с отступами между карточками (g-4) */}
        <div className="row g-4">
          {workouts.map((workout, idx) => (
            /* Каждая карточка занимает 4 колонки из 12 на ПК (md) и всю ширину на мобильных (12) */
            <div key={idx} className="col-12 col-md-4">
              <div className={styles['workout-card']}>
                <div className={styles['workout-card__image-wrapper']}>
                  <img
                    src={workout.imageUrl}
                    alt={workout.title}
                  />
                </div>

                <div className={styles['workout-card__info']}>
                  <h3>{workout.title}</h3>
                  <p className={styles['workout-card__difficulty']}>
                    Difficulty:{' '}
                    <span className={getDifficultyClass(workout.difficulty)}>
                      {workout.difficulty}
                    </span>
                  </p>
                  <p className={styles['workout-card__description']}>
                    {workout.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div> {/* Конец строки row */}

      </div> {/* Тот самый закрывающий тег контентной части, который я забыл вернуть */}


      {/* Нижняя навигационная панель */}
      <Footer />
    </div>
  );
};
