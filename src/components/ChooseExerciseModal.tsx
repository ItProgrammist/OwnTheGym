/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import styles from './scss/ChooseExerciseModal.module.scss';

interface BaseExercise {
  id: string;
  name: string;
  defaultReps: number;
  imageUrl: string;
}

interface ChooseExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercises: (selectedExercises: BaseExercise[]) => void;
}

export const ChooseExerciseModal: React.FC<ChooseExerciseModalProps> = ({
  isOpen,
  onClose,
  onAddExercises,
}) => {
  // Поисковый запрос
  const [searchQuery, setSearchQuery] = useState('');
  // Хранилище ID выбранных чекбоксами упражнений
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Глобальная база доступных упражнений для выбора
  const availableExercises: BaseExercise[] = [
    {
      id: 'ex-biceps-expander',
      name: 'Biceps curls with expander',
      defaultReps: 10,
      imageUrl: 'https://unsplash.com',
    },
    {
      id: 'ex-pushups-explosion',
      name: 'Push-Ups (4 sec. down + explosion)',
      defaultReps: 10,
      imageUrl: 'https://unsplash.com',
    },
    {
      id: 'ex-diamond-explosion',
      name: 'Diamond Push-Ups (4 sec. down + explosion)',
      defaultReps: 10,
      imageUrl: 'https://unsplash.com',
    },
  ];

  if (!isOpen) return null;

  // Переключение чекбокса
  const toggleExerciseSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Логика добавления выбранных упражнений
  const handleAddClick = () => {
    const exercisesToSubmit = availableExercises.filter((ex) =>
      selectedIds.includes(ex.id)
    );
    onAddExercises(exercisesToSubmit);
    setSelectedIds([]); // Сбрасываем выбранные
    onClose(); // Закрываем модалку
  };

  // Фильтрация списка по поисковой строке
  const filteredExercises = availableExercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
        
        {/* Шапка: Заголовок + Поисковая строка с лупой */}
        <div className="row g-0 align-items-center justify-content-between mb-4">
          <div className="col-auto">
            <h2 className={styles['modal-container__title']}>Choose an Exercise</h2>
          </div>
          
          <div className="col-6 col-sm-5 position-relative">
            <input 
              type="text" 
              placeholder="Search an exercise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles['modal-container__search-input']}
            />
            {/* Иконка лупы встроенная в инпут */}
            <span className={styles['modal-container__search-icon']}>
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="6" stroke="#22d3ee" strokeWidth="2.5"/>
                <path d="M16 16l4 4" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
        </div>

        {/* Скролл-список упражнений */}
        <div className="d-flex flex-column gap-3 mb-4">
          {filteredExercises.map((exercise) => {
            const isChecked = selectedIds.includes(exercise.id);
            return (
              <div 
                key={exercise.id} 
                className={`${styles['exercise-row']} ${isChecked ? styles['exercise-row--selected'] : ''}`}
                onClick={() => toggleExerciseSelection(exercise.id)}
              >
                <div className="row g-0 align-items-center w-full h-100">
                  
                  {/* Изображение */}
                  <div className="col-auto h-100">
                    <div className={styles['exercise-row__image-wrapper']}>
                      <img src={exercise.imageUrl} alt={exercise.name} />
                    </div>
                  </div>

                  {/* Текстовая информация (Имя + Базовое число) */}
                  <div className="col ps-3 pe-2 d-flex flex-column justify-content-center">
                    <h3 className={styles['exercise-row__name']}>{exercise.name}</h3>
                    <div className={styles['exercise-row__reps-badge']}>
                      {exercise.defaultReps}
                    </div>
                  </div>

                  {/* Кастомный Квадратный Чекбокс пиксель в пиксель */}
                  <div className="col-auto pe-4">
                    <div className={`${styles['custom-checkbox']} ${isChecked ? styles['custom-checkbox--checked'] : ''}`}>
                      {isChecked && (
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M4 12l6 6L20 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Главная кнопка отправки Add */}
        <button 
          className={styles['modal-container__add-btn']}
          onClick={handleAddClick}
          disabled={selectedIds.length === 0}
        >
          Add
        </button>

      </div>
    </div>
  );
};
