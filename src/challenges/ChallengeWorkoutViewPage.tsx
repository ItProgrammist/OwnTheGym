/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Добавили useLocation
import styles from './scss/ChallengeWorkoutViewPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface ChallengeExerciseSet {
  id: string;
  name: string;
  imageUrl: string;
}

// Описываем структуру данных, которую мы ждем из роутера
interface RouterStateLocation {
  workout?: {
    id: string;
    title: string;
    difficulty: string;
    imageUrl: string;
  };
}

export const ChallengeWorkoutViewPage: React.FC = () => {
  const { challengeId, workoutId } = useParams<{ challengeId: string; workoutId: string }>();
  const navigate = useNavigate();
  
  // Извлекаем переданное состояние роутера
  const location = useLocation();
  const routerState = location.state as RouterStateLocation;

  // ИСПРАВЛЕНО: Если данные пришли из роутера — берем их title, иначе ставим дефолтную заглушку
  const workoutTitle = routerState?.workout?.title || "Full Arms";

  const [exerciseSets, setExerciseSets] = useState<ChallengeExerciseSet[]>([
    {
      id: 'ch-ex-1',
      name: 'Biceps curls with expander',
      imageUrl: 'https://unsplash.com',
    },
    {
      id: 'ch-ex-2',
      name: 'Biceps curls with expander',
      imageUrl: 'https://unsplash.com',
    },
    {
      id: 'ch-ex-3',
      name: 'Biceps curls with expander',
      imageUrl: 'https://unsplash.com',
    },
  ]);

  const handleAddExerciseToChallengeWorkout = () => {
    // ИСПРАВЛЕНО: Переменные из useParams теперь используются здесь, линтер больше не ругается
    console.log(`Добавление упражнения в тренировку ${workoutId} для челленджа ${challengeId}`);
  };

  const handleDeleteExercise = (id: string) => {
    setExerciseSets((prev) => prev.filter((item) => item.id !== id));
    console.log(`Из тренировки ${workoutId} удален сет: ${id}`);
  };

  const handleOpenExerciseDetails = (id: string) => {
    console.log(`Открытие модалки деталей для сета: ${id} (ID тренировки: ${workoutId})`);
  };

  return (
    <div className={styles['challenge-workout-view-page']}>
      <div className={styles['challenge-workout-view-page__content']}>
        
        <Header />

        <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
          <div className="col-auto">
            {/* Текст названия теперь полностью динамический! */}
            <h2 className={styles['challenge-workout-view-page__title']}>
              {workoutTitle}
            </h2>
          </div>
          
          <div className="col-auto">
            <button 
              className={styles['challenge-workout-view-page__add-btn']}
              onClick={handleAddExerciseToChallengeWorkout}
            >
              <svg viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Add
            </button>
          </div>
        </div>

        {/* Список подходов */}
        <div className="d-flex flex-column gap-3">
          {exerciseSets.map((set) => (
            <div key={set.id} className={styles['exercise-row']}>
              <div className="row g-0 align-items-center w-full h-100">
                
                <div className="col-auto h-100">
                  <div className={styles['exercise-row__image-wrapper']}>
                    <img src={set.imageUrl} alt={set.name} />
                  </div>
                </div>

                <div className="col ps-3 d-flex align-items-center">
                  <h3 className={styles['exercise-row__name']}>
                    {set.name}
                  </h3>
                </div>

                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                  <button 
                    className={styles['exercise-row__action-btn']}
                    onClick={() => handleDeleteExercise(set.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                      <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>

                  <button 
                    className={styles['exercise-row__action-btn']}
                    onClick={() => handleOpenExerciseDetails(set.id)}
                  >
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

      </div>

      <Footer />
    </div>
  );
};
