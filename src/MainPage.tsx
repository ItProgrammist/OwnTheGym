/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './scss/MainPage.module.scss';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CalendarModal } from './components/CalendarModal';

interface CalendarDay {
  dayName: string;
  dayNumber: number;
  isCompleted: boolean;
}

interface WorkoutCard {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  description: string;
  imageUrl: string;
}

export const MainPage: React.FC = () => {
  const navigate = useNavigate();

  // Проверяем статус авторизации пользователя
  const isAuthenticated = !!localStorage.getItem('ownthegym_token');

  // Состояние для управления открытием модального окна полного календаря
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

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
      id: 'chest-mission',
      title: 'Chest Mission',
      difficulty: 'Hard',
      description: 'Includes: Negative, diamond, and controlled push-ups.',
      imageUrl: '/placeholder.png',
    },
    {
      id: 'arms-killer',
      title: 'Arms Killer',
      difficulty: 'Medium',
      description: 'Includes: Expander biceps and forearms curls, triceps kickbacks.',
      imageUrl: '/placeholder.png',
    },
    {
      id: 'leg-armageddon',
      title: 'Leg Armageddon',
      difficulty: 'Insane',
      description: 'Includes: Explosive jump squats, power lunges, Bulgarian split squats, wall sits...',
      imageUrl: '/placeholder.png',
    },
  ];

  const getDifficultyClass = (diff: 'Easy' | 'Medium' | 'Hard' | 'Insane') => {
    if (diff === 'Medium') return styles['workout-card__difficulty--medium'];
    if (diff === 'Hard') return styles['workout-card__difficulty--hard'];
    return styles['workout-card__difficulty--insane'];
  };

  return (
    <div className={styles['main-page']}>
      <div className={styles['main-page__content']}>

        {/* Глобальный логотип хедера */}
        <Header />

        {!isAuthenticated ? (
          /* ==========================================================================
             НЕАВТОРИЗОВАННЫЙ ВАРИАНТ: Отображаем только картинку-заглушку
             ========================================================================== */
          <div className="w-100 text-center mt-3" style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <h3>GET READY TO PROGRESS!</h3>
            <br />
            <h5>Sign in first.</h5>
            <br />
            <img 
              src="/header.jpg" // Путь Vite к изображению в папке public
              alt="Welcome to OwnTheGym" 
              className="img-fluid rounded-4 shadow-sm"
              style={{ maxWidth: '100%', height: 'auto', maxHeight: '460px', objectFit: 'cover' }}
            />
          </div>
        ) : (
          /* ==========================================================================
             АВТОРИЗОВАННЫЙ ВАРИАНТ: Полная базовая фитнес-логика
             ========================================================================== */
          <React.Fragment>
            {/* Навигация секции */}
            <div className={styles['main-page__section-nav']}>
              <h2>History</h2>
              <button onClick={() => setIsCalendarOpen(true)}>
                All Records
              </button>
            </div>

            {/* Календарная плашка на 7 дней */}
            <div className={styles['calendar-card']}>
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
            <div className="row g-4">
              {workouts.map((workout, idx) => (
                <div key={idx} className="col-12 col-md-4">
                  <div
                    className={styles['workout-card']}
                    onClick={() => navigate(`/workouts/${workout.id}`, { state: { workout: workout } })}
                    style={{ cursor: 'pointer' }}
                  >
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
            </div>
          </React.Fragment>
        )}

      </div>

      {/* Модалка полного календаря за месяц подвязана к состоянию страницы */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />

      {/* Нижняя навигационная панель */}
      <Footer />
    </div>
  );
};
