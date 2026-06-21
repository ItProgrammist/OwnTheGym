/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './scss/ChooseExerciseModal.module.scss';
import { workoutService, type ExerciseResponse } from '../api/workoutService';

interface ChooseExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Передаем наверх массив выбранных элементов бэкенда
  onAddExercises: (selected: ExerciseResponse[]) => void;
}

export const ChooseExerciseModal: React.FC<ChooseExerciseModalProps> = ({
  isOpen,
  onClose,
  onAddExercises,
}) => {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Подгружаем упражнения с бэкенда каждый раз при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      loadCatalogExercises();
      setSelectedIds([]); // Сбрасываем старые чекбоксы при новом открытии
    }
  }, [isOpen]);

  async function loadCatalogExercises() {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutService.getAllExercises();
      setExercises(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError('Не удалось загрузить каталог упражнений.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddClick = () => {
    // Фильтруем массив упражнений бэка, оставляя только те, чьи ID выбрал пользователь
    const selectedExercises = exercises.filter((ex) => selectedIds.includes(ex.id));
    
    if (selectedExercises.length > 0) {
      onAddExercises(selectedExercises);
    }
    onClose();
  };

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
        
        <h2 className={styles['modal-container__title']}>Choose Exercises</h2>

        {loading && <div className="text-center text-white my-3">Загрузка упражнений с бэка...</div>}
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        {/* Скролл-лист элементов глобального каталога упражнений */}
        <div className={styles['exercise-list-scroll']}>
          {!loading && exercises.length === 0 && !error && (
            <div className="text-center text-muted py-3">База данных упражнений пуста.</div>
          )}
          
          {exercises.map((ex) => (
            <div 
              key={ex.id} 
              className={`${styles['exercise-item']} ${selectedIds.includes(ex.id) ? styles['exercise-item--selected'] : ''}`}
              onClick={() => handleToggleSelect(ex.id)}
            >
              <div className="row g-0 align-items-center w-100">
                <div className="col-auto pe-3">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(ex.id)}
                    onChange={() => handleToggleSelect(ex.id)}
                    className={styles['exercise-checkbox']}
                    onClick={(e) => e.stopPropagation()} // Изолируем клик чекбокса
                  />
                </div>
                <div className="col text-start">
                  <h4 className={styles['exercise-item__name']}>{ex.title}</h4>
                  <p className={styles['exercise-item__desc']}>{ex.description || 'Нет описания'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Нижняя панель кнопок управления */}
        <div className="row g-0 justify-content-end gap-2 mt-4">
          <button className={`${styles['modal-btn']} ${styles['modal-btn--close']}`} onClick={onClose}>
            Cancel
          </button>
          <button 
            className={`${styles['modal-btn']} ${styles['modal-btn--save']}`} 
            onClick={handleAddClick}
            disabled={selectedIds.length === 0}
          >
            Add ({selectedIds.length})
          </button>
        </div>

      </div>
    </div>
  );
};
