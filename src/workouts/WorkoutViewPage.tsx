/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './scss/WorkoutViewPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ExerciseModal } from '../components/ExerciseModal';

interface ExerciseItem {
  id: number;
  name: string;
  reps: number;
  imageUrl: string;
  description: string;
}

interface RouterStateLocation {
  workout?: {
    id: string;
    title: string;
    difficulty: string;
    imageUrl: string;
  };
}

export const WorkoutViewPage: React.FC = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as RouterStateLocation;

  // Динамически подтягиваем имя тренировки из роутера, либо ставим заглушку
  const workoutTitle = routerState?.workout?.title || 'Arms Killer';

  // Состояние для хранения выбранного упражнения (для модалки три точки)
  const [activeExercise, setActiveExercise] = useState<ExerciseItem | null>(null);

  // Список подходов упражнений текущей тренировки
  const [exercises, setExercises] = useState<ExerciseItem[]>([
    {
      id: 1,
      name: 'Biceps curls with expander',
      reps: 25,
      imageUrl: 'https://unsplash.com',
      description: "This exercise is a real beast. You don't have to worry about your spine so much, it focuses only on biceps."
    },
    {
      id: 2,
      name: 'Biceps curls with expander',
      reps: 20,
      imageUrl: 'https://unsplash.com',
      description: "Second set. Maintain strict control on the negative phase of the movement."
    },
    {
      id: 3,
      name: 'Biceps curls with expander',
      reps: 15,
      imageUrl: 'https://unsplash.com',
      description: "Final set. Push to maximum failure while keeping perfect form."
    },
  ]);

  // Изменение reps из ExerciseModal (три точки)
  const handleSaveReps = (newReps: number) => {
    if (!activeExercise) return;
    setExercises((prev) =>
      prev.map((ex) => (ex.id === activeExercise.id ? { ...ex, reps: newReps } : ex))
    );
  };

  const handleDeleteExerciseSet = (id: number) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  // Переход на страницу конструктора (передаем объект воркаута дальше в state)
  const handleEditWorkoutRedirect = () => {
    navigate(`/workouts/${workoutId}/edit`, { state: { workout: routerState?.workout } });
  };

  return (
    <div className={styles['workout-view-page']}>
      <div className={styles['workout-view-page__content']}>
        
        {/* Кликабельный логотип */}
        <Header />

        {/* Шапка: Название воркаута + Кнопки управления Редактировать / Удалить */}
        <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
          <div className="col-auto">
            <h2 className={styles['workout-view-page__title']}>
              {workoutTitle}
            </h2>
          </div>
          
          <div className="col-auto d-flex align-items-center gap-2">
            {/* Кнопка-карандаш редактирования всей тренировки */}
            <button 
              className={styles['workout-view-page__control-btn']}
              onClick={handleEditWorkoutRedirect}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#2563eb" />
                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Розовая кнопка удаления всей тренировки */}
            <button className={styles['workout-view-page__control-btn']}>
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="#fca5a5" />
                <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Список подходов тренировки */}
        <div className="d-flex flex-column gap-3 mb-4">
          {exercises.map((item) => (
            <div key={item.id} className={styles['exercise-row']}>
              <div className="row g-0 align-items-center w-full h-100">
                
                {/* Картинка сета */}
                <div className="col-auto h-100">
                  <div className={styles['exercise-row__image-wrapper']}>
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                </div>

                {/* Название сета + Количество повторов */}
                <div className="col ps-3 d-flex flex-column justify-content-center">
                  <h3 className={styles['exercise-row__name']}>{item.name}</h3>
                  <span className={styles['exercise-row__reps']}>x{item.reps}</span>
                </div>

                {/* Кнопки удаления сета и подробностей */}
                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                  <button 
                    className={styles['exercise-row__action-btn']}
                    onClick={() => handleDeleteExerciseSet(item.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                      <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>

                  <button 
                    className={styles['exercise-row__action-btn']}
                    onClick={() => setActiveExercise(item)}
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

        {/* Большая синяя кнопка запуска активного воркаута */}
        <button 
          className={styles['workout-view-page__start-btn']}
          onClick={() => navigate(`/workouts/${workoutId}/active`)}
        >
          Start Workout
        </button>

      </div>

      {/* Модалка изменения reps у сета (три точки) */}
      <ExerciseModal 
        isOpen={activeExercise !== null}
        onClose={() => setActiveExercise(null)}
        onSave={(updatedData) => handleSaveReps(updatedData.reps)}
        exerciseName={activeExercise?.name || ''}
        initialReps={activeExercise?.reps || 0}
        description={activeExercise?.description || ''}
        videoThumbnail={activeExercise?.imageUrl}
      />

      <Footer />
    </div>
  );
};
