/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './scss/ActiveWorkoutPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import {
  workoutService,
  type WorkoutItem,
  type WorkoutSetPost,
} from '../api/workoutService';
import { getVideoEmbedLink } from '../utils/videoEmbed';

interface ActiveSetState {
  id: string;
  exerciseId: string;
  name: string;
  reps: number;
  time: number;
  description: string;
  videoUrl: string;
  isFinished: boolean;
}

const enrichWorkoutSets = async (
  workoutData: WorkoutItem,
  previousSets: ActiveSetState[] = []
): Promise<ActiveSetState[]> =>
  Promise.all(
    workoutData.sets.map(async (set, index) => {
      const previous = previousSets[index];
      try {
        const exercise = await workoutService.getExerciseById(set.exerciseId);
        return {
          id: set.id,
          exerciseId: set.exerciseId,
          name: set.exerciseTitle || exercise.title,
          reps: set.numberOfReps ?? 0,
          time: set.amountOfTime ?? 0,
          description: exercise.description || '',
          videoUrl: exercise.videoUrl || '',
          isFinished: previous?.isFinished ?? false,
        };
      } catch {
        return {
          id: set.id,
          exerciseId: set.exerciseId,
          name: set.exerciseTitle || previous?.name || 'Упражнение',
          reps: set.numberOfReps ?? 0,
          time: set.amountOfTime ?? 0,
          description: previous?.description || '',
          videoUrl: previous?.videoUrl || '',
          isFinished: previous?.isFinished ?? false,
        };
      }
    })
  );

export const ActiveWorkoutPage: React.FC = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<WorkoutItem | null>(null);
  const [sets, setSets] = useState<ActiveSetState[]>([]);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [completing, setCompleting] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mode, setMode] = useState<'reps' | 'time'>('reps');
  const [inputValue, setInputValue] = useState<number>(0);

  useEffect(() => {
    if (!workoutId) return;

    const loadWorkout = async () => {
      setLoading(true);
      try {
        const workoutData = await workoutService.getWorkoutById(workoutId);
        setWorkout(workoutData);
        setSets(await enrichWorkoutSets(workoutData));
      } catch (err) {
        console.error('Ошибка при загрузке активной тренировки:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId]);

  const currentSet = sets[currentSetIndex];

  useEffect(() => {
    if (!currentSet) return;
    setIsPlaying(false);
    const currentMode = currentSet.time > 0 ? 'time' : 'reps';
    setMode(currentMode);
    setInputValue(currentMode === 'time' ? currentSet.time : currentSet.reps);
  }, [currentSetIndex, currentSet?.id, currentSet?.reps, currentSet?.time]);

  const buildWorkoutPayload = (nextSets: ActiveSetState[]) => ({
    title: workout!.title,
    description: workout!.description || 'Custom typical workout session',
    level: workout!.level,
    type: workout!.type || 'TYPICAL' as const,
    sets: nextSets.map((s) => ({
      exerciseId: s.exerciseId,
      numberOfReps: Number(s.reps),
      amountOfTime: Number(s.time),
    })) as WorkoutSetPost[],
  });

  const applyCurrentInputToSets = (sourceSets: ActiveSetState[]): ActiveSetState[] =>
    sourceSets.map((item, idx) =>
      idx === currentSetIndex
        ? {
          ...item,
          reps: mode === 'reps' ? inputValue : 0,
          time: mode === 'time' ? inputValue : 0,
        }
        : item
    );

  const persistWorkoutSets = async (nextSets: ActiveSetState[]) => {
    if (!workoutId || !workout) {
      throw new Error('Missing workout data');
    }

    const updatedWorkout = await workoutService.updateWorkout(
      workoutId,
      buildWorkoutPayload(nextSets)
    );
    const enrichedSets = await enrichWorkoutSets(updatedWorkout, nextSets);

    setWorkout(updatedWorkout);
    setSets(enrichedSets);
    return enrichedSets;
  };

  const handleToggleMode = () => {
    const nextMode = mode === 'reps' ? 'time' : 'reps';
    setMode(nextMode);
    if (currentSet) {
      setInputValue(nextMode === 'time' ? currentSet.time : currentSet.reps);
    }
  };

  const handleSaveCurrentSet = async () => {
    const nextSets = applyCurrentInputToSets(sets);

    try {
      setSaving(true);
      await persistWorkoutSets(nextSets);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverError = err.response?.data?.message || err.response?.data?.error;
        alert(`Не удалось сохранить сет. Ошибка: ${serverError || 'Некорректные данные'}`);
      } else {
        alert('Не удалось сохранить сет.');
      }
    } finally {
      setSaving(false);
    }
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

  const handleDoneExercise = async () => {
    if (!workoutId) return;

    const nextSets = applyCurrentInputToSets(sets).map((item, idx) =>
      idx === currentSetIndex ? { ...item, isFinished: true } : item
    );

    setSets(nextSets);

    const isLastExercise = currentSetIndex === sets.length - 1;

    if (isLastExercise) {
      try {
        setCompleting(true);

        await persistWorkoutSets(nextSets);

        await workoutService.completeWorkout(workoutId, {
          day: new Date().toISOString(),
        });

        navigate('/statistics');
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const serverError =
            err.response?.data?.message ||
            err.response?.data?.error;

          alert(
            `Не удалось завершить тренировку. Ошибка: ${serverError || 'Ошибка сервера'
            }`
          );
        } else {
          alert('Не удалось завершить тренировку.');
        }
      } finally {
        setCompleting(false);
      }

      return;
    }

    setTimeout(() => {
      setCurrentSetIndex((prev) => prev + 1);
    }, 300);
  };

  if (loading) {
    return <div className="text-center text-white mt-5">Загрузка тренировки...</div>;
  }

  if (!workout || sets.length === 0 || !currentSet) {
    return <div className="text-center text-white mt-5">Тренировка не найдена или не содержит упражнений.</div>;
  }

  const embedLink = getVideoEmbedLink(currentSet.videoUrl);
  const isLinkValid = embedLink.length > 0;

  return (
    <div className={styles['active-workout-page']}>
      <div className={styles['active-workout-page__content']}>
        <Header />

        <div className="row g-0 align-items-center mb-4 px-1">
          <div className="col-auto d-flex align-items-center gap-3">
            <h2 className={styles['active-workout-page__title']}>{workout.title}</h2>
            <div className={styles['active-workout-page__badge']}>
              {currentSetIndex + 1}/{sets.length}
            </div>
          </div>

          <div className="col-auto ms-auto d-flex gap-2">
            {/* <button className={styles['active-workout-page__control-btn']} onClick={() => navigate(`/workouts/${workoutId}/edit`, { state: { workout } })}>
              <svg viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#2563eb" />
                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button> */}
            <button className={styles['active-workout-page__control-btn']} onClick={() => navigate('/workouts')}>
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="#fca5a5" />
                <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles['exercise-display-card']}>
          <h3 className={styles['exercise-display-card__name']}>{currentSet.name}</h3>

          <div className={styles['video-player']}>
            {isPlaying && isLinkValid ? (
              <iframe
                key={`${currentSet.id}-${embedLink}`}
                src={embedLink}
                title="Exercise video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className={styles['video-player__iframe']}
                style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}
              ></iframe>
            ) : isPlaying && !isLinkValid ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 p-3 text-center bg-black">
                <p className="small text-white-50 mb-2">Неподдерживаемый формат ссылки.</p>
                {currentSet.videoUrl.trim() && (
                  <a href={currentSet.videoUrl.trim()} target="_blank" rel="noopener noreferrer" className="text-info small">
                    Открыть в новой вкладке
                  </a>
                )}
              </div>
            ) : (
              <React.Fragment>
                <img src="/placeholder.png" alt="Demo" className={styles['video-player__thumbnail']} />
                <button
                  type="button"
                  className={styles['video-player__play-btn']}
                  onClick={() => setIsPlaying(true)}
                  disabled={!currentSet.videoUrl.trim()}
                  style={{ opacity: currentSet.videoUrl.trim() ? 1 : 0.4 }}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7z" fill="#3b82f6" />
                  </svg>
                </button>
              </React.Fragment>
            )}
          </div>

          <div className="row g-0 align-items-center justify-content-between mb-4">
            <div className="col-auto d-flex align-items-center">
              <span className={styles['exercise-display-card__reps-label']}>
                {mode === 'reps' ? 'Reps' : 'Time'}
              </span>
              <button
                type="button"
                className={styles['exercise-display-card__link-icon']}
                onClick={handleToggleMode}
                title="Переключить режим"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </button>
            </div>

            <div className="col-auto d-flex align-items-center gap-1">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className={styles['exercise-display-card__reps-input']}
              />
              {mode === 'time' && <span className={styles['exercise-display-card__seconds-text']}>s.</span>}
            </div>
          </div>

          <div className="row g-0 align-items-end">
            <div className="col pe-3">
              <p className={styles['exercise-display-card__description']}>
                {currentSet.description || 'Описание техники выполнения этого упражнения отсутствует.'}
              </p>
            </div>

            <div className="col-auto d-flex gap-2">
              <button
                className={`${styles['modal-btn']} ${styles['modal-btn--save']}`}
                onClick={handleSaveCurrentSet}
                disabled={saving || completing}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>

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
              <button
                className={styles['done-workout-btn']}
                onClick={handleDoneExercise}
                disabled={completing || saving}
              >
                {completing ? 'Finishing...' : 'Done'}
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
