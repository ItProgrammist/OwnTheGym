/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import styles from './scss/ExerciseModal.module.scss';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reps: number) => void;
  exerciseName: string;
  initialReps: number;
  description?: string;
  videoThumbnail?: string;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  exerciseName,
  initialReps,
  description = "This exercise is a real beast. You don't have to worry about your spine so much, it focuses only on biceps.",
  videoThumbnail = 'https://unsplash.com',
}) => {
  const [reps, setReps] = useState<number>(initialReps);

  if (!isOpen) return null;

  const handleSaveClick = () => {
    onSave(reps);
    onClose();
  };

  return (
    /* Оверлей, который растягивается на весь экран и затемняет задний фон */
    <div className={styles['modal-overlay']} onClick={onClose}>
      
      {/* Контейнер самой карточки модального окна */}
      <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
        
        {/* Название упражнения */}
        <h2 className={styles['modal-container__title']}>{exerciseName}</h2>

        {/* Блок видеоплеера */}
        <div className={styles['video-player']}>
          <img src={videoThumbnail} alt="Exercise" className={styles['video-player__thumbnail']} />
          <button className={styles['video-player__play-btn']}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8 5v14l11-7z" fill="#3b82f6" />
            </svg>
          </button>
        </div>

        {/* Инпут и лейбл количества повторений */}
        <div className="row g-0 align-items-center justify-content-between mb-4">
          <div className="col-auto d-flex align-items-center">
            <span className={styles['modal-container__reps-label']}>Reps</span>
            <span className={styles['modal-container__link-icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </span>
          </div>
          
          <div className="col-auto">
            <input 
              type="number" 
              value={reps} 
              onChange={(e) => setReps(Number(e.target.value))}
              className={styles['modal-container__reps-input']} 
            />
          </div>
        </div>

        {/* Нижняя строка: Описание + Кнопки действий */}
        <div className="row g-0 align-items-end">
          <div className="col pe-3">
            <p className={styles['modal-container__description']}>
              {description}
            </p>
          </div>
          
          <div className="col-auto d-flex gap-2">
            <button className={`${styles['modal-btn']} ${styles['modal-btn--close']}`} onClick={onClose}>
              Close
            </button>
            <button className={`${styles['modal-btn']} ${styles['modal-btn--save']}`} onClick={handleSaveClick}>
              Save
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
