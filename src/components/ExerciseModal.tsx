/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import styles from './scss/ExerciseModal.module.scss';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: { name: string; reps: number; description: string }) => void;
  exerciseName: string;
  initialReps: number;
  description: string;
  videoThumbnail?: string;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  exerciseName,
  initialReps,
  description,
  videoThumbnail = 'https://unsplash.com',
}) => {
  // Локальные стейты для инпутов, чтобы изменения можно было редактировать
  const [name, setName] = useState<string>(exerciseName);
  const [reps, setReps] = useState<number>(initialReps);
  const [desc, setDesc] = useState<string>(description);

  // Синхронизируем стейт при открытии окна под новое выбранное упражнение
  useEffect(() => {
    if (isOpen) {
      setName(exerciseName);
      setReps(initialReps);
      setDesc(description);
    }
  }, [isOpen, exerciseName, initialReps, description]);

  if (!isOpen) return null;

  const handleSaveClick = () => {
    onSave({ name, reps, description: desc });
    onClose();
  };

  const handleEditVideo = () => {
    console.log('Вызов логики изменения или добавления ссылки на видео');
  };

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
        
        {/* НАЗВАНИЕ: Теперь это текстовый инпут, оформленный под плашку */}
        <div className="mb-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles['modal-container__title-input']}
            placeholder="Exercise name..."
          />
        </div>

        {/* Блок видеоплеера */}
        <div className={styles['video-player']}>
          <img src={videoThumbnail} alt="Exercise video preview" className={styles['video-player__thumbnail']} />
          <button className={styles['video-player__play-btn']}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8 5v14l11-7z" fill="#3b82f6" />
            </svg>
          </button>
        </div>

        {/* Средняя панель: Редактирование Reps и кнопка Edit/Add Video */}
        <div className="row g-0 align-items-center justify-content-between mb-3 px-1">
          {/* Блок Reps */}
          <div className="col-auto d-flex align-items-center">
            <span className={styles['modal-container__reps-label']}>Reps</span>
            <span className={styles['modal-container__link-icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </span>
            <input 
              type="number" 
              value={reps} 
              onChange={(e) => setReps(Number(e.target.value))}
              className={styles['modal-container__reps-input']} 
            />
          </div>
          
          {/* Новая кнопка Edit/Add Video справа по макету */}
          <div className="col-auto">
            <button className={styles['modal-container__video-btn']} onClick={handleEditVideo}>
              <span>Edit/Add Video</span>
              <svg viewBox="0 0 24 24" fill="none" className="ms-2">
                <rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Нижняя часть: Текстовое поле описания + Кнопки управления */}
        <div className="row g-0 align-items-end">
          {/* ОПИСАНИЕ: Теперь это многострочный textarea, оформленный в виде сине-серой плашки */}
          <div className="col pe-3">
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className={styles['modal-container__description-textarea']}
              placeholder="Add an exercise description..."
              rows={3}
            />
          </div>
          
          {/* Кнопки Close и Save */}
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
