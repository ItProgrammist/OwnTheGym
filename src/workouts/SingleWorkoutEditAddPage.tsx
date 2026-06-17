/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useParams } from 'react-router-dom'; // Хук для получения ID тренировки из URL
import styles from './scss/SingleWorkoutEditAddPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface ExerciseSet {
  id: number;
  name: string;
  reps: number;
  imageUrl: string;
}

export const SingleWorkoutEditAddPage: React.FC = () => {
  const { workoutId } = useParams<{ workoutId: string }>();

  // Тестовые данные подходов для макета (в реальном проекте будут загружаться по workoutId)
  const exerciseSets: ExerciseSet[] = [
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

  return (
    <div className={styles['workout-edit-page']}>
      <div className={styles['workout-edit-page__content']}>
        
        {/* Глобальный кликабельный логотип */}
        <Header />

        {/* Заголовок страницы */}
        <h2 className={styles['workout-edit-page__title']}>Edit Workout</h2>

        {/* Панель управления: Редактирование, Инпуты и Кнопка добавления */}
        <div className="row g-0 align-items-center mb-4 px-1 gap-2 gap-sm-3">
          {/* Кнопка-карандаш */}
          <div className="col-auto">
            <button className={styles['workout-edit-page__edit-icon-btn']}>
              <svg viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#2563eb" />
                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Инпут Названия воркаута */}
          <div className="col col-sm-3">
            <input 
              type="text" 
              placeholder="Workout Name..." 
              className={styles['workout-edit-page__input']}
            />
          </div>

          {/* Дропдаун Выбора сложности */}
          <div className="col col-sm-4">
            <div className={styles['workout-edit-page__dropdown']}>
              <span>Choose the diff...</span>
              <svg viewBox="0 0 24 24" fill="none" className="ms-2">
                <path d="M7 10l5 5 5-5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Кнопка Add a Set */}
          <div className="col-auto ms-auto">
            <button className={styles['workout-edit-page__add-set-btn']}>
              <svg viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Add a Set
            </button>
          </div>
        </div>

        {/* Список подходов / упражнений тренировки */}
        <div className="d-flex flex-column gap-3 mb-4">
          {exerciseSets.map((set) => (
            <div key={set.id} className={styles['exercise-card']}>
              <div className="row g-0 align-items-center w-full h-100">
                
                {/* Картинка упражнения */}
                <div className="col-auto h-100">
                  <div className={styles['exercise-card__image-wrapper']}>
                    <img src={set.imageUrl} alt={set.name} />
                  </div>
                </div>

                {/* Текстовая информация (Название + Повторения) */}
                <div className="col ps-3 d-flex flex-column justify-content-center">
                  <h3 className={styles['exercise-card__name']}>{set.name}</h3>
                  <span className={styles['exercise-card__reps']}>x{set.reps}</span>
                </div>

                {/* Кнопки действий справа */}
                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                  {/* Кнопка удаления (розовый круг с крестиком) */}
                  <button className={styles['exercise-card__action-btn']}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                      <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>

                  {/* Кнопка контекстного меню (синий круг с троеточием) */}
                  <button className={styles['exercise-card__action-btn']}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#2563eb" />
                      <circle cx="8" cy="12" r="1" fill="white" />
                      <circle cx="12" cy="12" r="1" fill="white" />
                      <circle cx="16" cy="12" r="1" fill="white" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Большая главная синяя кнопка сохранения */}
        <button className={styles['workout-edit-page__save-btn']}>
          Save Changes
        </button>

      </div>

      {/* Глобальный интерактивный таб-бар */}
      <Footer />
    </div>
  );
};
