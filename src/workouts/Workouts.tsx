/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './scss/Workouts.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { workoutService, type WorkoutItem } from '../api/workoutService';

export const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadWorkouts() {
    try {
      setLoading(true);
      setError(null); // Сбрасываем старую ошибку перед новым запросом
      const data = await workoutService.getTypicalWorkouts();
      
      // ИСПРАВЛЕНО: Гарантируем, что в стейт запишется именно массив, 
      // даже если бэкенд вернул null или пустой ответ
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('Ошибка при загрузке воркаутов:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Не удалось загрузить тренировки с сервера.');
      } else {
        setError('Произошла непредвиденная ошибка при сетевом запросе.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkouts();
  }, []);

  // ИСПРАВЛЕНО: Добавлена безопасная проверка входящей строки уровня сложности
  function getDifficultyClass(diff: string | undefined | null) {
    if (!diff) return styles['workout-row__difficulty--medium'];
    const upperDiff = diff.toUpperCase();
    if (upperDiff === 'EASY' || upperDiff === 'MEDIUM') return styles['workout-row__difficulty--medium'];
    if (upperDiff === 'HARD') return styles['workout-row__difficulty--hard'];
    return styles['workout-row__difficulty--insane'];
  }

  function handleCreateWorkout() {
    navigate('/workouts/new/edit');
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!id) return;
    if (!window.confirm('Вы уверены, что хотите удалить эту тренировку?')) return;
    try {
      await workoutService.deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w?.id !== id));
    } catch (err: unknown) {
      alert('Ошибка при удалении тренировки на сервере.');
    }
  }

  function handleEdit(e: React.MouseEvent, workout: WorkoutItem) {
    e.stopPropagation();
    if (!workout?.id) return;
    navigate(`/workouts/${workout.id}/edit`, { state: { workout } });
  }

  return (
    <div className={styles['workouts-page']}>
      <div className={styles['workouts-page__content']}>
        <Header />

        <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
          <div className="col-auto">
            <h2 className={styles['workouts-page__title']}>Workouts</h2>
          </div>
          <div className="col-auto">
            <button className={styles['workouts-page__add-btn']} onClick={handleCreateWorkout}>
              <svg viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Add
            </button>
          </div>
        </div>

        {loading && <div className="text-center text-white mt-4">Загрузка тренировок...</div>}
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        {!loading && !error && workouts.length === 0 && (
          <div className="text-center text-muted mt-4">У вас пока нет созданных тренировок.</div>
        )}

        <div className="d-flex flex-column gap-3">
          {/* ИСПРАВЛЕНО: Добавлены безопасные операторы ?. для предотвращения падения при рендере */}
          {workouts.map((workout) => {
            if (!workout) return null;
            return (
              <div 
                key={workout.id} 
                className={styles['workout-row-link']}
                onClick={() => navigate(`/workouts/${workout.id}`, { state: { workout } })}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles['workout-row']}>
                  <div className="row g-0 align-items-center w-full h-100">
                    <div className="col-auto h-100">
                      <div className={styles['workout-row__image-wrapper']}>
                        <img src="/placeholder.png" alt={workout.title || 'Workout'} />
                      </div>
                    </div>

                    <div className="col ps-3 d-flex flex-column justify-content-center">
                      <h3 className={styles['workout-row__title']}>{workout.title || 'Без названия'}</h3>
                      <p className={styles['workout-row__difficulty-label']}>
                        Difficulty:{' '}
                        <span className={getDifficultyClass(workout.level)}>
                          {workout.level || 'MEDIUM'}
                        </span>
                      </p>
                    </div>

                    <div className="col-auto pe-3 d-flex align-items-center gap-2">
                      <button className={styles['workout-row__action-btn']} onClick={(e) => handleDelete(e, workout.id)}>
                        <svg viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                          <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>

                      <button className={styles['workout-row__action-btn']} onClick={(e) => handleEdit(e, workout)}>
                        <svg viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="2" width="20" height="20" rx="4" fill="#1d4ed8" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1.5" />
                          <path d="M7 17l2.5.5L17 10l-3-3-7.5 7.5L7 17zM13 8l3 3" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};
