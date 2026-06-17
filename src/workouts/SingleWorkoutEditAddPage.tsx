/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './scss/SingleWorkoutEditAddPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ExerciseModal } from '../components/ExerciseModal';
import { ChooseExerciseModal } from '../components/ChooseExerciseModal';

// Интерфейс для подходов на текущей странице
interface ExerciseSet {
  id: number;
  name: string;
  reps: number;
  imageUrl: string;
  description?: string;
}

// 1. Строгий интерфейс для входящих данных из каталога упражнений (убираем any)
interface BaseExerciseFromCatalog {
  id: string;
  name: string;
  defaultReps: number;
  imageUrl: string;
}

export const SingleWorkoutEditAddPage: React.FC = () => {
  const { workoutId } = useParams<{ workoutId: string }>();

  // Стейт для модального окна РЕДАКТИРОВАНИЯ (три точки)
  const [activeSet, setActiveSet] = useState<ExerciseSet | null>(null);

  // Стейт для модального окна ВЫБОРА нового упражнения (Add a Set)
  const [isChooseModalOpen, setIsChooseModalOpen] = useState<boolean>(false);

  // Основной стейт списка подходов тренировки
  const [sets, setSets] = useState<ExerciseSet[]>([
    {
      id: 1,
      name: 'Biceps curls with expander',
      reps: 25,
      imageUrl: '../../public/placeholder.png',
      description: "This exercise is a real beast. You don't have to worry about your spine so much, it focuses only on biceps."
    },
    {
      id: 2,
      name: 'Biceps curls with expander',
      reps: 20,
      imageUrl: '../../public/placeholder.png',
      description: "Second set. Maintain strict control on the negative phase of the movement."
    },
    {
      id: 3,
      name: 'Biceps curls with expander',
      reps: 15,
      imageUrl: '../../public/placeholder.png',
      description: "Final set. Push to maximum failure while keeping perfect form."
    },
  ]);

  // Сохранение измененного числа повторений из модалки редактирования
  const handleSaveReps = (newReps: number) => {
    if (!activeSet) return;

    setSets((prevSets) =>
      prevSets.map((item) =>
        item.id === activeSet.id ? { ...item, reps: newReps } : item
      )
    );
  };

  // Удаление упражнения из списка конструктора
  const handleDeleteSet = (id: number) => {
    setSets((prevSets) => prevSets.filter((item) => item.id !== id));
  };

  // 2. Указываем строгий тип BaseExerciseFromCatalog[] вместо any[]
  const handleAddNewExercises = (selectedExercises: BaseExerciseFromCatalog[]) => {
    const updatedSets: ExerciseSet[] = selectedExercises.map((ex, index) => ({
      id: Date.now() + index, // Генерация уникального числового ID
      name: ex.name,
      reps: ex.defaultReps,
      imageUrl: ex.imageUrl,
      description: "Added from exercise catalog."
    }));

    setSets((prev) => [...prev, ...updatedSets]);
  };

  return (
    <div className={styles['workout-edit-page']}>
      <div className={styles['workout-edit-page__content']}>
        
        {/* Кликабельный логотип */}
        <Header />

        {/* Заголовок страницы */}
        <h2 className={styles['workout-edit-page__title']}>Edit Workout</h2>

        {/* Панель управления */}
        <div className="row g-0 align-items-center mb-4 px-1 gap-2 gap-sm-3">
          <div className="col-auto">
            <button className={styles['workout-edit-page__edit-icon-btn']}>
              <svg viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#2563eb" />
                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="col col-sm-3">
            <input 
              type="text" 
              placeholder="Workout Name..." 
              className={styles['workout-edit-page__input']}
            />
          </div>

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
            <button 
              className={styles['workout-edit-page__add-set-btn']}
              onClick={() => setIsChooseModalOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Add a Set
            </button>
          </div>
        </div>

        {/* Текущий список подходов */}
        <div className="d-flex flex-column gap-3 mb-4">
          {sets.map((set) => (
            <div key={set.id} className={styles['exercise-card']}>
              <div className="row g-0 align-items-center w-full h-100">
                
                <div className="col-auto h-100">
                  <div className={styles['exercise-card__image-wrapper']}>
                    <img src={set.imageUrl} alt={set.name} />
                  </div>
                </div>

                <div className="col ps-3 d-flex flex-column justify-content-center">
                  <h3 className={styles['exercise-card__name']}>{set.name}</h3>
                  <span className={styles['exercise-card__reps']}>x{set.reps}</span>
                </div>

                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                  <button 
                    className={styles['exercise-card__action-btn']}
                    onClick={() => handleDeleteSet(set.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                      <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>

                  <button 
                    className={styles['exercise-card__action-btn']}
                    onClick={() => setActiveSet(set)}
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

        {/* Главная кнопка сохранения */}
        <button className={styles['workout-edit-page__save-btn']}>
          Save Changes
        </button>

      </div>

      {/* Модалка 1: Редактирование */}
      <ExerciseModal 
        isOpen={activeSet !== null}
        onClose={() => setActiveSet(null)}
        onSave={handleSaveReps}
        exerciseName={activeSet?.name || ''}
        initialReps={activeSet?.reps || 0}
        description={activeSet?.description}
        videoThumbnail="https://unsplash.com"
      />

      {/* Модалка 2: Выбор новых упражнений */}
      <ChooseExerciseModal 
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
        onAddExercises={handleAddNewExercises}
      />

      <Footer />
    </div>
  );
};
