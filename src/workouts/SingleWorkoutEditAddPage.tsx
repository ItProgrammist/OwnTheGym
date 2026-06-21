/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './scss/SingleWorkoutEditAddPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ExerciseModal } from '../components/ExerciseModal';
import { ChooseExerciseModal } from '../components/ChooseExerciseModal';
import {
  workoutService,
  type WorkoutItem,
  type WorkoutLevel,
  type WorkoutSetPost,
  type WorkoutSetGet,
} from '../api/workoutService';

interface LocalExerciseSet {
  id: string;
  exerciseId: string;
  name: string;
  reps: number;
  time: number;
}

export const SingleWorkoutEditAddPage: React.FC = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as { workout?: WorkoutItem };

  const [workoutName, setWorkoutName] = useState<string>(routerState?.workout?.title || '');
  const [difficulty, setDifficulty] = useState<WorkoutLevel | ''>(
    (routerState?.workout?.level?.toUpperCase() as WorkoutLevel) || ''
  );
  const [workoutDescription, setWorkoutDescription] = useState<string>(
    routerState?.workout?.description || 'Custom typical workout session'
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isChooseModalOpen, setIsChooseModalOpen] = useState<boolean>(false);
  const [activeSet, setActiveSet] = useState<LocalExerciseSet | null>(null);
  const [loading, setLoading] = useState<boolean>(workoutId !== 'new' && !routerState?.workout);

  const [sets, setSets] = useState<LocalExerciseSet[]>(
    routerState?.workout?.sets.map((s, index) => ({
      id: s.id || `set-${Date.now()}-${index}`,
      exerciseId: s.exerciseId,
      name: s.exerciseTitle || 'Упражнение',
      reps: s.numberOfReps || 0,
      time: s.amountOfTime || 0,
    })) || []
  );

  useEffect(() => {
    if (!workoutId || workoutId === 'new') return;

    setLoading(true);
    workoutService.getWorkoutById(workoutId)
      .then((data) => {
        setWorkoutName(data.title);
        setDifficulty(data.level);
        setWorkoutDescription(data.description || 'Custom typical workout session');
        setSets(mapWorkoutSetsToLocal(data.sets));
      })
      .catch((err) => console.error('Ошибка при загрузке тренировки:', err))
      .finally(() => setLoading(false));
  }, [workoutId]);

  const mapWorkoutSetsToLocal = (workoutSets: WorkoutSetGet[]): LocalExerciseSet[] =>
    workoutSets.map((s, index) => ({
      id: s.id || `set-${Date.now()}-${index}`,
      exerciseId: s.exerciseId,
      name: s.exerciseTitle || 'Упражнение',
      reps: s.numberOfReps || 0,
      time: s.amountOfTime || 0,
    }));

  const buildWorkoutPayload = (nextSets: LocalExerciseSet[]) => {
    const formattedSets: WorkoutSetPost[] = nextSets.map((s) => ({
      exerciseId: s.exerciseId,
      numberOfReps: Number(s.reps),
      amountOfTime: Number(s.time),
    }));

    return {
      title: workoutName.trim(),
      description: workoutDescription,
      level: difficulty as WorkoutLevel,
      type: 'TYPICAL' as const,
      sets: formattedSets,
    };
  };

  const handleDeleteSet = (id: string) => {
    setSets((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddNewExercises = (selectedExercises: { id: string; title: string }[]) => {
    const updatedSets: LocalExerciseSet[] = selectedExercises.map((ex, index) => ({
      id: `new-set-${Date.now()}-${index}`,
      exerciseId: ex.id,
      name: ex.title,
      reps: 10,
      time: 0,
    }));
    setSets((prev) => [...prev, ...updatedSets]);
  };

  async function handleSaveChanges() {
    if (!workoutName.trim()) {
      alert('Пожалуйста, введите название тренировки.');
      return;
    }
    if (!difficulty) {
      alert('Пожалуйста, выберите уровень сложности.');
      return;
    }
    if (sets.length === 0) {
      alert('Добавьте хотя бы одно упражнение в тренировку.');
      return;
    }

    const payload = buildWorkoutPayload(sets);

    try {
      if (workoutId === 'new') {
        await workoutService.createWorkout(payload);
      } else if (workoutId) {
        await workoutService.updateWorkout(workoutId, payload);
      }
      navigate('/workouts');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverError = err.response?.data?.message || err.response?.data?.error;
        alert(`Не удалось сохранить воркаут на сервере. Ошибка: ${serverError || 'Некорректные данные DTO'}`);
      } else {
        alert('Произошла непредвиденная ошибка при отправке запроса.');
      }
    }
  }

  if (loading) {
    return <div className="text-center text-white mt-5">Загрузка тренировки...</div>;
  }

  return (
    <div className={styles['workout-edit-page']}>
      <div className={styles['workout-edit-page__content']}>
        <Header />

        <h2 className={styles['workout-edit-page__title']}>
          {workoutId === 'new' ? 'Add New Workout' : 'Edit Workout'}
        </h2>

        <div className="row g-0 align-items-center mb-4 px-1 gap-2 gap-sm-3 position-relative">
          <div className="col-auto">
            <div className={styles['workout-edit-page__edit-icon-btn']}>
              <svg viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#2563eb" />
                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="col col-sm-3">
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Workout Name..."
              className={styles['workout-edit-page__input']}
            />
          </div>

          <div className="col col-sm-4 position-relative">
            <div className={styles['workout-edit-page__dropdown']} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <span>{difficulty ? difficulty : 'Choose the diff...'}</span>
              <svg viewBox="0 0 24 24" fill="none" className="ms-2"><path d="M7 10l5 5 5-5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            {isDropdownOpen && (
              <div className={styles['dropdown-menu-list']}>
                {(['EASY', 'MEDIUM', 'HARD', 'INSANE'] as WorkoutLevel[]).map((lvl) => (
                  <div
                    key={lvl}
                    className={styles['dropdown-item-option']}
                    onClick={() => { setDifficulty(lvl); setIsDropdownOpen(false); }}
                  >
                    {lvl}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-auto ms-auto">
            <button className={styles['workout-edit-page__add-set-btn']} onClick={() => setIsChooseModalOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" className="me-2"><circle cx="12" cy="12" r="11" fill="#22c55e" /><path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
              Add a Set
            </button>
          </div>
        </div>

        <div className="d-flex flex-column gap-3 mb-4">
          {sets.map((set) => (
            <div key={set.id} className={styles['exercise-card']}>
              <div className="row g-0 align-items-center w-full h-100">
                <div className="col-auto h-100">
                  <div className={styles['exercise-card__image-wrapper']}>
                    <img src="/placeholder.png" alt={set.name} />
                  </div>
                </div>
                <div className="col ps-3 d-flex flex-column justify-content-center">
                  <h3 className={styles['exercise-card__name']}>{set.name}</h3>
                  <span className={styles['exercise-card__reps']}>
                    {set.time > 0 ? `${set.time} s.` : `x${set.reps}`}
                  </span>
                </div>
                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                  <button className={styles['exercise-card__action-btn']} onClick={() => handleDeleteSet(set.id)}>
                    <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#fca5a5" /><path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /></svg>
                  </button>
                  <button className={styles['exercise-card__action-btn']} onClick={() => setActiveSet(set)}>
                    <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#2563eb" /><circle cx="8" cy="12" r="1" fill="white" /><circle cx="12" cy="12" r="1" fill="white" /><circle cx="16" cy="12" r="1" fill="white" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className={styles['workout-edit-page__save-btn']} onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>

      <ExerciseModal
        isOpen={activeSet !== null}
        onClose={() => setActiveSet(null)}
        exerciseId={activeSet?.exerciseId}
        exerciseName={activeSet?.name || ''}
        initialReps={activeSet?.reps || 0}
        initialTime={activeSet?.time || 0}
        onSave={async (updatedData) => {
          if (!activeSet) {
            throw new Error('Missing set data');
          }

          const nextSets = sets.map((item) =>
            item.id === activeSet.id
              ? {
                ...item,
                reps: updatedData.mode === 'reps' ? Number(updatedData.reps) : 0,
                time: updatedData.mode === 'time' ? Number(updatedData.time) : 0,
              }
              : item
          );

          setSets(nextSets);

          if (workoutId && workoutId !== 'new') {
            if (!difficulty) {
              alert('Пожалуйста, выберите уровень сложности.');
              throw new Error('Missing difficulty');
            }

            const updatedWorkout = await workoutService.updateWorkout(
              workoutId,
              buildWorkoutPayload(nextSets)
            );
            setSets(mapWorkoutSetsToLocal(updatedWorkout.sets));
          }
        }}
      />

      <ChooseExerciseModal isOpen={isChooseModalOpen} onClose={() => setIsChooseModalOpen(false)} onAddExercises={handleAddNewExercises} />
      <Footer />
    </div>
  );
};
