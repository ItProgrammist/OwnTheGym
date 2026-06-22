/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import styles from './scss/EditChallengeWorkoutModal.module.scss';

interface ChallengeWorkoutData {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
}

interface EditChallengeWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workoutData: { id: string; title: string; difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane' }) => void;
  workout: ChallengeWorkoutData | null; 
}

export const EditChallengeWorkoutModal: React.FC<EditChallengeWorkoutModalProps> = ({
  isOpen,
  onClose,
  onSave,
  workout,
}) => {
  // ИСПРАВЛЕНО: Прямо при инициализации стейта проверяем, передан ли воркаут.
  // Это избавляет от необходимости использовать useEffect и вызывать синхронный setState.
  const [workoutName, setWorkoutName] = useState<string>(workout ? workout.title : '');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Insane' | ''>(workout ? workout.difficulty : '');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSaveClick = () => {
    if (!workoutName.trim() || !difficulty) return;
    
    onSave({
      id: workout ? workout.id : '', 
      title: workoutName.trim(),
      difficulty: difficulty as 'Easy' | 'Medium' | 'Hard' | 'Insane'
    });
    onClose();
  };

  const handleSelectDifficulty = (value: 'Easy' | 'Medium' | 'Hard' | 'Insane') => {
    setDifficulty(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
        
        <h2 className={styles['modal-container__title']}>
          {workout ? 'Edit Challenge Workout' : 'Add New Workout'}
        </h2>

        <div className="row g-0 align-items-center mb-4 gap-3 position-relative">
          <div className="col-auto">
            <div className={styles['modal-container__edit-icon']}>
              <svg viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#2563eb" />
                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="col col-sm-5">
            <input 
              type="text" 
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Workout Name..." 
              className={styles['modal-container__input']}
            />
          </div>

          <div className="col col-sm-4 position-relative">
            <div 
              className={styles['modal-container__dropdown']}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{difficulty ? difficulty : 'Choose the diff...'}</span>
              <svg viewBox="0 0 24 24" fill="none" className="ms-2" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="M7 10l5 5 5-5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className={styles['dropdown-menu-list']}>
                <div className={styles['dropdown-item-option']} onClick={() => handleSelectDifficulty('Easy')}>Easy</div>
                <div className={styles['dropdown-item-option']} onClick={() => handleSelectDifficulty('Medium')}>Medium</div>
                <div className={styles['dropdown-item-option']} onClick={() => handleSelectDifficulty('Hard')}>Hard</div>
                <div className={styles['dropdown-item-option']} onClick={() => handleSelectDifficulty('Insane')}>Insane</div>
              </div>
            )}
          </div>
        </div>

        <div className="row g-0 justify-content-end gap-2 mt-5">
          <button className={`${styles['modal-btn']} ${styles['modal-btn--close']}`} onClick={onClose}>
            Close
          </button>
          <button 
            className={`${styles['modal-btn']} ${styles['modal-btn--save']}`} 
            onClick={handleSaveClick}
            disabled={!workoutName.trim() || !difficulty}
          >
            {workout ? 'Save Changes' : 'Create Workout'}
          </button>
        </div>

      </div>
    </div>
  );
};
