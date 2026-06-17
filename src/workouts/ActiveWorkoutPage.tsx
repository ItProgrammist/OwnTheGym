/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './scss/ActiveWorkoutPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface WorkoutSet {
  id: number;
  name: string;
  reps: number;
  description: string;
  videoThumbnail: string;
  isFinished: boolean;
}

export const ActiveWorkoutPage: React.FC = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();

  const [sets, setSets] = useState<WorkoutSet[]>([
    {
      id: 1,
      name: 'Biceps curls with expander',
      reps: 25,
      description: "This exercise is a real beast. You don't have to worry about your spine so much, it focuses only on biceps.",
      videoThumbnail: 'https://unsplash.com',
      isFinished: false,
    },
    {
      id: 2,
      name: 'Hammer curls',
      reps: 20,
      description: "Great for building forearm and brachialis thickness. Keep your elbows pinned!",
      videoThumbnail: 'https://unsplash.com',
      isFinished: false,
    },
  ]);

  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);
  const currentSet = sets[currentSetIndex];
  const workoutTitle = workoutId === 'arms-killer' ? 'Arms Killer' : 'Chest Mission';

  // Функция для динамического изменения повторений прямо во время тренировки
  const handleRepsChange = (newReps: number) => {
    setSets((prevSets) =>
      prevSets.map((item, idx) =>
        idx === currentSetIndex ? { ...item, reps: newReps } : item
      )
    );
  };

  const handlePrevSet = () => {
    if (currentSetIndex > 0) {
      setCurrentSetIndex((prev) => prev - 1);
    }
  };

  const handleNextSet = () => {
    if (currentSetIndex < sets.length - 1) {
      setCurrentSetIndex((prev) => prev + 1);
    }
  };

  const handleDoneExercise = () => {
    setSets((prevSets) =>
      prevSets.map((item, idx) =>
        idx === currentSetIndex ? { ...item, isFinished: true } : item
      )
    );
    if (currentSetIndex < sets.length - 1) {
      setTimeout(() => {
        setCurrentSetIndex((prev) => prev + 1);
      }, 300);
    }
  };

  return (
    <div className={styles['active-workout-page']}>
      <div className={styles['active-workout-page__content']}>
        
        <Header />

        {/* Панель информации */}
        <div className="row g-0 align-items-center mb-4 px-1">
          <div className="col-auto d-flex align-items-center gap-3">
            <h2 className={styles['active-workout-page__title']}>{workoutTitle}</h2>
            <div className={styles['active-workout-page__badge']}>
              {currentSetIndex + 1}/{sets.length}
            </div>
          </div>

          <div className="col-auto ms-auto d-flex gap-2">
            <button className={styles['active-workout-page__control-btn']} onClick={() => navigate(`/workouts/${workoutId}/edit`)}>
              <svg viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#2563eb" />
                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className={styles['active-workout-page__control-btn']} onClick={() => navigate('/workouts')}>
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="#fca5a5" />
                <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Карточка упражнения */}
        <div className={styles['exercise-display-card']}>
          <h3 className={styles['exercise-display-card__name']}>{currentSet.name}</h3>

          <div className={styles['video-player']}>
            <img src={currentSet.videoThumbnail} alt="Demo" className={styles['video-player__thumbnail']} />
            <button className={styles['video-player__play-btn']}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M8 5v14l11-7z" fill="#3b82f6" />
              </svg>
            </button>
          </div>

          {/* Секция изменения повторений пиксель в пиксель */}
          <div className="row g-0 align-items-center justify-content-between mb-4">
            <div className="col-auto d-flex align-items-center">
              <span className={styles['exercise-display-card__reps-label']}>Reps</span>
              <span className={styles['exercise-display-card__link-icon']}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </span>
            </div>
            
            {/* ТЕПЕРЬ ТУТ СТОИТ ИНПУТ ВМЕСТО DIV */}
            <div className="col-auto">
              <input 
                type="number"
                value={currentSet.reps}
                onChange={(e) => handleRepsChange(Number(e.target.value))}
                className={styles['exercise-display-card__reps-input']}
              />
            </div>
          </div>

          <div className="row g-0 align-items-end">
            <div className="col pe-3">
              <p className={styles['exercise-display-card__description']}>
                {currentSet.description}
              </p>
            </div>
            
            <div className="col-auto d-flex gap-2">
              {/* <button className={`${styles['modal-btn']} ${styles['modal-btn--close']}`} onClick={() => navigate('/workouts')}>
                Close
              </button> */}
              <button className={`${styles['modal-btn']} ${styles['modal-btn--save']}`} onClick={handleNextSet}>
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Панель управления (Done / Стрелки) */}
        <div className="row g-0 align-items-center justify-content-between mt-4">
          <div className="col-auto">
            <button className={styles['navigation-arrow-btn']} onClick={handlePrevSet} disabled={currentSetIndex === 0}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
              </svg>
            </button>
          </div>

          <div className="col-6 col-sm-8 px-2">
            {currentSet.isFinished ? (
              <div className={styles['completed-badge']}>
                <svg viewBox="0 0 24 24" fill="none" className="me-2 d-inline-block" style={{ width: '1.25rem' }}>
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Completed
              </div>
            ) : (
              <button className={styles['done-workout-btn']} onClick={handleDoneExercise}>
                Done
              </button>
            )}
          </div>

          <div className="col-auto">
            <button className={styles['navigation-arrow-btn']} onClick={handleNextSet} disabled={currentSetIndex === sets.length - 1}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};
