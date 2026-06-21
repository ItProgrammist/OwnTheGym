/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './scss/ExercisesPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { UpsertExerciseModal } from '../components/UpsertExerciseModal';
import { workoutService, type ExerciseResponse, type ExerciseRequest } from '../api/workoutService';

export const ExercisesPage: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Стейты управления универсальным модальным окном
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseResponse | null>(null);

  async function loadExercises() {
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

  useEffect(() => {
    loadExercises();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingExercise(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exercise: ExerciseResponse) => {
    setEditingExercise(exercise);
    setIsModalOpen(true);
  };

  const handleDeleteExercise = async (id: string) => {
    if (!window.confirm('Удалить это упражнение из каталога бэкенда?')) return;
    try {
      await workoutService.deleteExercise(id);
      setExercises((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Ошибка при удалении.');
    }
  };

  const handleSaveExercise = async (payload: ExerciseRequest) => {
    if (editingExercise) {
      const updatedData = await workoutService.updateExercise(editingExercise.id, payload);
      setExercises((prev) => prev.map((item) => (item.id === editingExercise.id ? updatedData : item)));
    } else {
      const newData = await workoutService.createExercise(payload);
      setExercises((prev) => [...prev, newData]);
    }
  };

  return (
    <div className={styles['exercises-page']}>
      <div className={styles['exercises-page__content']}>
        <Header />

        <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
          <div className="col-auto">
            <h2 className={styles['exercises-page__title']}>Exercises</h2>
          </div>
          <div className="col-auto">
            <button className={styles['exercises-page__add-btn']} onClick={handleOpenCreateModal}>
              <svg viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Add
            </button>
          </div>
        </div>

        {loading && <div className="text-center text-white mt-4">Загрузка каталога...</div>}
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        {!loading && !error && exercises.length === 0 && (
          <div className="text-center text-muted mt-4">Каталог упражнений на сервере пока пуст.</div>
        )}

        <div className="d-flex flex-column gap-3">
          {exercises.map((item) => (
            <div key={item.id} className={styles['exercise-row']}>
              <div className="row g-0 align-items-center w-full h-100">
                <div className="col-auto h-100">
                  <div className={styles['exercise-row__image-wrapper']}>
                    <img src="/placeholder.png" alt={item.title} />
                  </div>
                </div>

                <div className="col ps-3 d-flex flex-column justify-content-center text-start">
                  <h3 className={styles['exercise-row__name']}>{item.title}</h3>
                  <p className={styles['exercise-row__desc']}>{item.description || 'Нет описания техники'}</p>
                </div>

                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                  {/* Крестик удаления */}
                  <button className={styles['exercise-row__action-btn']} onClick={() => handleDeleteExercise(item.id)}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                      <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>

                  {/* ИСПРАВЛЕНО: Теперь на плашке выводится ТОЛЬКО ОДНА ИКОНКА «ТРИ ТОЧКИ», которая сразу открывает редактирование */}
                  <button className={styles['exercise-row__action-btn']} onClick={() => handleOpenEditModal(item)}>
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

      {/* Наше новое универсальное окно создания/редактирования */}
      <UpsertExerciseModal
        key={editingExercise ? editingExercise.id : 'new-exercise'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExercise}
        exercise={editingExercise}
      />

      <Footer />
    </div>
  );
};
