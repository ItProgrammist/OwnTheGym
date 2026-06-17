/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './scss/SingleWorkoutPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface ExerciseItem {
  id: number;
  name: string;
  reps: number;
  imageUrl: string;
}

export const SingleWorkoutPage: React.FC = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();

  // Имитация данных (динамически подгружается имя нужной тренировки)
  const workoutTitle = workoutId === 'arms-killer' ? 'Arms Killer' : 'Chest Mission';

  const exercises: ExerciseItem[] = [
    {
      id: 1,
      name: 'Biceps curls with expander',
      reps: 25,
      imageUrl: '../../public/placeholder.png',
    },
    {
      id: 2,
      name: 'Biceps curls with expander',
      reps: 20,
      imageUrl: '../../public/placeholder.png',
    },
    {
      id: 3,
      name: 'Biceps curls with expander',
      reps: 15,
      imageUrl: '../../public/placeholder.png',
    },
  ];

  // Переход на страницу редактирования по клику на карандаш
  const handleEditRedirect = () => {
    navigate(`/workouts/${workoutId}/edit`);
  };

  const handleDeleteWorkout = () => {
    console.log('Удаление всей тренировки');
  };

  const handleStartWorkout = () => {
    console.log('Старт тренировки активирован!');
  };

  return (
    <div className={styles['workout-view-page']}>
      <div className={styles['workout-view-page__content']}>
        
        {/* Кликабельный глобальный логотип */}
        <Header />

        {/* Шапка секции: Название + Кнопки управления справа */}
        <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
          <div className="col-auto">
            <h2 className={styles['workout-view-page__title']}>{workoutTitle}</h2>
          </div>
          
          {/* Кнопки управления (Редактировать + Удалить) */}
          <div className="col-auto d-flex align-items-center gap-2">
            {/* Синяя кнопка-карандаш редактирования */}
            <button 
              className={styles['workout-view-page__control-btn']}
              onClick={handleEditRedirect}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#2563eb" />
                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Розовая кнопка удаления тренировки */}
            <button 
              className={styles['workout-view-page__control-btn']}
              onClick={handleDeleteWorkout}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="#fca5a5" />
                <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Список упражнений (компоновка один в один) */}
        <div className="d-flex flex-column gap-3 mb-4">
          {exercises.map((item) => (
            <div key={item.id} className={styles['exercise-row']}>
              <div className="row g-0 align-items-center w-full h-100">
                
                {/* Картинка */}
                <div className="col-auto h-100">
                  <div className={styles['exercise-row__image-wrapper']}>
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                </div>

                {/* Инфо (Название + Повторения) */}
                <div className="col ps-3 d-flex flex-column justify-content-center">
                  <h3 className={styles['exercise-row__name']}>{item.name}</h3>
                  <span className={styles['exercise-row__reps']}>x{item.reps}</span>
                </div>

                {/* Индикаторы действий на упражнении */}
                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                  <div className={styles['exercise-row__status-icon']}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                      <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className={styles['exercise-row__status-icon']}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#2563eb" />
                      <circle cx="8" cy="12" r="1" fill="white" />
                      <circle cx="12" cy="12" r="1" fill="white" />
                      <circle cx="16" cy="12" r="1" fill="white" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Большая главная синяя кнопка Start Workout */}
        <button 
          className={styles['workout-view-page__start-btn']}
          onClick={handleStartWorkout}
        >
          Start Workout
        </button>

      </div>

      {/* Интерактивный футер */}
      <Footer />
    </div>
  );
};
