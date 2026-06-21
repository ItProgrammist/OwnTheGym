/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './scss/WorkoutViewPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ExerciseModal } from '../components/ExerciseModal';
import { workoutService, type WorkoutItem, type WorkoutSetGet } from '../api/workoutService';

export const WorkoutViewPage: React.FC = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as { workout?: WorkoutItem };

  const [workout, setWorkout] = useState<WorkoutItem | null>(routerState?.workout || null);
  const [activeExercise, setActiveExercise] = useState<WorkoutSetGet | null>(null);
  const [loading, setLoading] = useState<boolean>(!workout);

  // Локальные состояния для хранения полных данных текущего выбранного упражнения
  const [exerciseDescription, setExerciseDescription] = useState<string>('');
  const [exerciseVideoUrl, setExerciseVideoUrl] = useState<string>('');

  useEffect(() => {
    if (workoutId) {
      setLoading(true);
      workoutService.getWorkoutById(workoutId)
        .then((data) => setWorkout(data))
        .catch((err) => console.error('Ошибка при получении воркаута:', err))
        .finally(() => setLoading(false));
    }
  }, [workoutId]);

  // ЭФФЕКТ СИНХРОНИЗАЦИИ: При клике на три точки подтягиваем видео-ссылку упражнения с сервера
  useEffect(() => {
    if (activeExercise?.exerciseId) {
      workoutService.getExerciseById(activeExercise.exerciseId)
        .then((res) => {
          // Записываем оригинальное описание и полную ссылку на видео (Google Drive / YouTube)
          setExerciseDescription(res.description || 'Описание техники отсутствует.');
          setExerciseVideoUrl(res.videoUrl || '');
        })
        .catch((err) => {
          console.error('Не удалось загрузить данные видео для упражнения:', err);
          setExerciseDescription('Описание техники отсутствует.');
          setExerciseVideoUrl('');
        });
    }
  }, [activeExercise]);

  const buildWorkoutPayload = (sets: WorkoutSetGet[]) => ({
    title: workout!.title,
    description: workout!.description || 'Custom typical workout session',
    level: workout!.level,
    type: workout!.type || ('TYPICAL' as const),
    sets: sets.map((s) => ({
      exerciseId: s.exerciseId,
      numberOfReps: Number(s.numberOfReps ?? 0),
      amountOfTime: Number(s.amountOfTime ?? 0),
    })),
  });

  const handleDeleteEntireWorkout = async () => {
    if (!workoutId || !window.confirm('Удалить эту тренировку целиком с сервера?')) return;
    try {
      await workoutService.deleteWorkout(workoutId);
      navigate('/workouts');
    } catch {
      alert('Не удалось удалить воркаут.');
    }
  };

  if (loading) return <div className="text-center text-white mt-5">Загрузка информации...</div>;
  if (!workout) return <div className="text-center text-white mt-5">Воркаут не найден.</div>;

  return (
    <div className={styles['workout-view-page']}>
      <div className={styles['workout-view-page__content']}>
        <Header />

        <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
          <div className="col-auto">
            <h2 className={styles['workout-view-page__title']}>{workout.title}</h2>
          </div>

          <div className="col-auto d-flex align-items-center gap-2">
            <button className={styles['workout-view-page__control-btn']} onClick={() => navigate(`/workouts/${workoutId}/edit`, { state: { workout } })}>
              <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#2563eb" /><path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button className={styles['workout-view-page__control-btn']} onClick={handleDeleteEntireWorkout}>
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#fca5a5" /><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        <div className="d-flex flex-column gap-3 mb-4">
          {workout.sets.map((item) => (
            <div key={item.id} className={styles['exercise-row']}>
              <div className="row g-0 align-items-center w-full h-100">
                <div className="col-auto h-100">
                  <div className={styles['exercise-row__image-wrapper']}>
                    <img src="/placeholder.png" alt={item.exerciseTitle} />
                  </div>
                </div>
                <div className="col ps-3 d-flex flex-column justify-content-center">
                  <h3 className={styles['exercise-row__name']}>{item.exerciseTitle}</h3>
                  <span className={styles['exercise-row__reps']}>
                    {item.amountOfTime > 0 ? `${item.amountOfTime} s.` : `x${item.numberOfReps}`}
                  </span>
                </div>
                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                  <button className={styles['exercise-row__action-btn']}>
                    <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#fca5a5" /><path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /></svg>
                  </button>
                  <button className={styles['exercise-row__action-btn']} onClick={() => setActiveExercise(item)}>
                    <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#2563eb" /><circle cx="8" cy="12" r="1" fill="white" /><circle cx="12" cy="12" r="1" fill="white" /><circle cx="16" cy="12" r="1" fill="white" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className={styles['workout-view-page__start-btn']} onClick={() => navigate(`/workouts/${workoutId}/active`, { state: { workout } })}>
          Start Workout
        </button>
      </div>

      {/* АВТОМАТИЧЕСКАЯ ОТПРАВКА КОРРЕКТНОГО МАССИВА СЕТОВ НА ПОРТ 8080 ПРИ КЛИКЕ НА SAVE */}
      <ExerciseModal
        isOpen={activeExercise !== null}
        onClose={() => setActiveExercise(null)}
        exerciseName={activeExercise?.exerciseTitle || ''}
        initialReps={activeExercise?.numberOfReps || 0}
        initialTime={activeExercise?.amountOfTime || 0}
        // Передаем динамически подгруженные с сервера текст и видео-ссылку (включая Google Диск)
        description={exerciseDescription}
        videoThumbnail={exerciseVideoUrl} 
        onSave={async (updatedData) => {
          if (!workoutId || !workout || !activeExercise) {
            throw new Error('Missing workout data');
          }

          // Рассчитываем актуальные числовые сеты на основе выбранного режима reps/time в модалке
          const nextSets = workout.sets.map((s) =>
            s.id === activeExercise.id
              ? {
                ...s,
                numberOfReps: updatedData.mode === 'reps' ? Number(updatedData.reps) : 0,
                amountOfTime: updatedData.mode === 'time' ? Number(updatedData.time) : 0,
              }
              : s
          );

          // Шлём единый PUT-запрос воркаута на сервер Spring Boot (порт 8080)
          const updatedWorkout = await workoutService.updateWorkout(
            workoutId,
            buildWorkoutPayload(nextSets)
          );
          
          // Фиксируем обновленный массив в стейте, чтобы данные не пропадали при F5
          setWorkout(updatedWorkout);
        }}
      />

      <Footer />
    </div>
  );
};
