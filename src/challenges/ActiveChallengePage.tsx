/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './scss/ActiveChallengePage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { workoutService, type WorkoutItem, type WorkoutSetGet } from '../api/workoutService';

interface FlattenedChallengeStep {
  workoutId: string;
  workoutTitle: string;
  exerciseId: string;
  exerciseTitle: string;
  numberOfReps: number;
  amountOfTime: number;
  isFinished: boolean;
}


export const ActiveChallengePage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('%c!!! СТРАНИЦА CHALLENGE ФИЗИЧЕСКИ ОТКРЫЛАСЬ НА ЭКРАНЕ !!!', 'background: #2563eb; color: white; font-size: 16px; font-weight: bold; padding: 4px 8px;');
  console.log('challengeId из URL:', challengeId);
  console.log('Полный location.state, пришедший с прошлой страницы:', location.state);


  const incomingChallenge = (location.state as any)?.challenge;
  const challengeTitle = incomingChallenge?.title || "Active Challenge";

  const [flattenedSteps, setFlattenedSteps] = useState<FlattenedChallengeStep[]>([]);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [mode, setMode] = useState<'reps' | 'time'>('reps');
  const [inputValue, setInputValue] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [exerciseDescription, setExerciseDescription] = useState<string>('');
  const [exerciseVideoUrl, setExerciseVideoUrl] = useState<string>('');

  useEffect(() => {
    if (incomingChallenge && incomingChallenge.workouts) {
      async function assembleFlattenedSteps() {
        const flatList: FlattenedChallengeStep[] = [];

        try {
          // Идем по каждой SPECIAL-тренировке челленджа
          for (const wk of incomingChallenge.workouts) {
            if (!wk || !wk.id) continue;

            const fullWorkout = await workoutService.getWorkoutById(wk.id);

            if (fullWorkout && fullWorkout.sets) {
              fullWorkout.sets.forEach((s: any) => {
                flatList.push({
                  workoutId: fullWorkout.id,
                  workoutTitle: fullWorkout.title,
                  exerciseId: s.exerciseId,
                  exerciseTitle: s.exerciseTitle,
                  numberOfReps: s.numberOfReps || 0,
                  amountOfTime: s.amountOfTime || 0,
                  isFinished: false
                });
              });
            }
          }

          console.log('=== [УСПЕХ] СБОРКА ЧЕЛЛЕНДЖА ЗАВЕРШЕНА ===');
          console.log('Всего шагов/упражнений собрано:', flatList.length);
          console.log('Итоговый плоский список:', flatList);

          setFlattenedSteps(flatList);
        } catch (err) {
          console.error('Ошибка при сборке сквозных шагов челленджа:', err);
        }
      }

      assembleFlattenedSteps();
    }
  }, [incomingChallenge]);

  // useEffect(() => {
  //   console.log('%c=== [АКТИВНЫЙ ЧЕЛЛЕНДЖ] СТАРТ СБОРКИ ШАГОВ ===', 'color: #3b82f6; font-weight: bold;');
  //   console.log('Что прилетело в incomingChallenge:', incomingChallenge);

  //   if (incomingChallenge && incomingChallenge.workouts) {
  //     async function assembleFlattenedSteps() {
  //       const flatList: FlattenedChallengeStep[] = [];
  //       console.log(`Найдено тренировок во вложенном массиве челленджа: ${incomingChallenge.workouts.length}`);

  //       try {
  //         for (let i = 0; i < incomingChallenge.workouts.length; i++) {
  //           const wk = incomingChallenge.workouts[i];
  //           console.log(`Разбираем тренировку №${i + 1}:`, wk);

  //           if (!wk || !wk.id) {
  //             console.warn(`⚠️ Пропуск тренировки №${i + 1}: отсутствует ID!`);
  //             continue;
  //           }

  //           console.log(`Шлём сетевой запрос GET /workouts/${wk.id} на порт 5050...`);
  //           const fullWorkout = await workoutService.getWorkoutById(wk.id);
  //           console.log(`Ответ бэкенда для воркаута ${wk.id}:`, fullWorkout);

  //           if (fullWorkout && fullWorkout.sets) {
  //             console.log(`У тренировки "${fullWorkout.title}" найдено сетов: ${fullWorkout.sets.length}`);

  //             fullWorkout.sets.forEach((s: any, setIdx: number) => {
  //               console.log(`  -> Добавляем упражнение №${setIdx + 1}:`, s.exerciseTitle);
  //               flatList.push({
  //                 workoutId: fullWorkout.id,
  //                 workoutTitle: fullWorkout.title,
  //                 exerciseId: s.exerciseId,
  //                 exerciseTitle: s.exerciseTitle,
  //                 numberOfReps: s.numberOfReps || 0,
  //                 amountOfTime: s.amountOfTime || 0,
  //                 isFinished: false
  //               });
  //             });
  //           } else {
  //             console.warn(`⚠️ Массив sets пуст или отсутствует у воркаута: ${wk.id}`);
  //           }
  //         }

  //         console.log('%c=== ФИНАЛЬНЫЙ РЕЗУЛЬТАТ СБОРКИ ===', 'color: #22c55e; font-weight: bold;');
  //         console.log('Итоговый массив плоских шагов (flatList):', flatList);
  //         console.log('Количество элементов:', flatList.length);

  //         setFlattenedSteps(flatList);
  //       } catch (err) {
  //         console.error('Ошибка внутри асинхронного цикла сборки:', err);
  //       }
  //     }

  //     assembleFlattenedSteps();
  //   } else {
  //     console.warn('⚠️ incomingChallenge или incomingChallenge.workouts равен undefined/null!');
  //   }
  // }, [incomingChallenge]);



  useEffect(() => {
    if (flattenedSteps.length > 0 && flattenedSteps[currentSetIndex]) {
      const activeStep = flattenedSteps[currentSetIndex];
      setIsPlaying(false);

      if (activeStep.amountOfTime > 0) {
        setMode('time');
        setInputValue(activeStep.amountOfTime);
      } else {
        setMode('reps');
        setInputValue(activeStep.numberOfReps);
      }

      workoutService.getExerciseById(activeStep.exerciseId)
        .then((res) => {
          setExerciseDescription(res.description || '12344311');
          setExerciseVideoUrl(res.videoUrl || '');
        })
        .catch(() => {
          setExerciseDescription('12344311');
          setExerciseVideoUrl('');
        });
    }
  }, [currentSetIndex, flattenedSteps]);

  if (flattenedSteps.length === 0) {
    return <div className="text-center text-white mt-5">Загрузка программы челленджа...</div>;
  }

  const currentStep = flattenedSteps[currentSetIndex] || null;
  const isLastSet = flattenedSteps.length > 0 ? (currentSetIndex === flattenedSteps.length - 1) : true;


  const getVideoSource = (url: string): string => {
    if (!url) return '';
    const trimmedUrl = url.trim();
    if (trimmedUrl.toLowerCase().includes('://google.com') || trimmedUrl.toLowerCase().includes('://google.com')) {
      const driveMatch = trimmedUrl.match(/\/d\/([^/]+)/);
      if (driveMatch && driveMatch) return 'https://://google.com/file/d/' + driveMatch[1] + '/preview';
    }
    const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const ytMatch = trimmedUrl.match(youtubeRegExp);
    if (ytMatch && ytMatch[2] && ytMatch[2].length === 11) {
      return 'https://youtube.com' + ytMatch[2] + '?autoplay=1&origin=' + window.location.origin;
    }
    return trimmedUrl;
  };

  const finalVideoSrc = getVideoSource(exerciseVideoUrl);

  const handleToggleMode = () => {
    setMode((prev) => (prev === 'reps' ? 'time' : 'reps'));
  };

  const handlePrevSet = () => {
    if (currentSetIndex > 0) {
      setCurrentSetIndex((prev) => prev - 1);
    }
  };

  const handleNextSet = () => {
    if (currentSetIndex < flattenedSteps.length - 1) {
      setCurrentSetIndex((prev) => prev + 1);
    }
  };

  const handleRepsChange = (value: number) => {
    setInputValue(value);
  };

  const handleDoneExercise = async () => {
    setFlattenedSteps((prev) =>
      prev.map((item, idx) => (idx === currentSetIndex ? { ...item, isFinished: true } : item))
    );

    if (!isLastSet) {
      setTimeout(() => {
        setCurrentSetIndex((prev) => prev + 1);
      }, 300);
    } else {
      try {
        setSubmitting(true);
        // await workoutService.completeChallenge(currentStep.workoutId);
        await workoutService.completeChallenge(challengeId?.toString());
        alert('Поздравляем! Челлендж полностью выполнен и зафиксирован на сервере!');
        navigate('/challenges');
      } catch (err) {
        console.error('Ошибка при фиксации прохождения челленджа:', err);
        alert('Не удалось отправить историю выполнения на сервер.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleLocalSave = () => {
    if (!currentStep) return;
    currentStep.numberOfReps = mode === 'reps' ? inputValue : 0;
    currentStep.amountOfTime = mode === 'time' ? inputValue : 0;
    alert('Параметры подхода сохранены на текущую сессию.');
  };

  return (
    <div className={styles['active-challenge-page']}>
      <div className={styles['active-challenge-page__content']}>
        <Header />

        {/* Название текущей тренировки */}
        <div className="text-start mb-2 px-1" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 className="fs-4 fw-bold" style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            {currentStep?.workoutTitle || "Загрузка тренировки..."}
          </h2>
        </div>

        {/* Шапка: Имя челленджа + Счетчик шагов + Кнопки */}
        <div className="row g-0 align-items-center mb-4 px-1" style={{ maxWidth: '640px', margin: '0 auto 1.5rem' }}>
          <div className="col-auto d-flex align-items-center gap-3">
            <h2 className={styles['active-challenge-page__title'] || 'fs-3 fw-bold m-0'}>{challengeTitle}</h2>
            <div className={styles['active-challenge-page__badge'] || 'badge rounded-pill bg-primary px-3 py-2 fw-bold'}>
              {currentSetIndex + 1}/{flattenedSteps.length}
            </div>
          </div>

          <div className="col-auto ms-auto d-flex gap-2">
            {/* ИСПРАВЛЕНО: Строка переписана на безопасные косые кавычки */}
            <button type="button" className={styles['active-challenge-page__control-btn'] || 'btn btn-secondary p-2'} onClick={() => navigate(`/challenges/${challengeId}/edit`)}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.25rem' }}><rect width="24" height="24" rx="4" fill="#2563eb" /><path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" className={styles['active-challenge-page__control-btn'] || 'btn btn-danger p-2'} onClick={() => navigate('/challenges')}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.25rem' }}><circle cx="12" cy="12" r="11" fill="#fca5a5" /><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        {/* Главная фиксированная плашка карточки упражнения */}
        <div className={styles['exercise-display-card']} style={{ maxWidth: '640px', margin: '0 auto 1.5rem', backgroundColor: '#2d2d2d', padding: '1.5rem', borderRadius: '1rem' }}>
          <h3 className={styles['exercise-display-card__name'] || 'fs-4 fw-bold mb-3'}>{currentStep?.exerciseTitle || "Загрузка упражнения..."}</h3>

          {/* Видеоплеер формата 16:9 */}
          <div className={styles['video-player']} style={{ aspectRatio: '16/9', position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '0.75rem', backgroundColor: '#000', marginBottom: '1.5rem' }}>
            {isPlaying && finalVideoSrc ? (
              <iframe key={finalVideoSrc} src={finalVideoSrc} title="Challenge track frame" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowFullScreen className="position-absolute top-0 start-0 w-100 h-100 border-0" style={{ pointerEvents: 'auto' }}></iframe>
            ) : (
              <React.Fragment>
                <img src="/placeholder.png" alt="Demo" className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" />
                <button type="button" className="btn position-absolute top-50 start-50 translate-middle p-0 d-flex align-items-center justify-content-center border-0" onClick={(e) => { e.stopPropagation(); setIsPlaying(true); }} disabled={!finalVideoSrc} style={{ width: '4rem', height: '2.5rem', backgroundColor: 'rgba(255, 255, 255, 0.75)', borderRadius: '0.625rem', opacity: finalVideoSrc ? 1 : 0.4 }}>
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.5rem', height: '1.5rem' }}><path d="M8 5v14l11-7z" fill="#3b82f6" /></svg>
                </button>
              </React.Fragment>
            )}
          </div>

          {/* Строка с изменяемым инпутом Reps / Time */}
          <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
            <div className="col-auto d-flex align-items-center">
              <span className={styles['exercise-display-card__reps-label'] || 'fs-5 fw-bold'}>{mode === 'reps' ? 'Reps' : 'Time'}</span>
              <span className={styles['exercise-display-card__link-icon'] || 'ms-2 text-info'} onClick={handleToggleMode} style={{ cursor: 'pointer' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.25rem', height: '1.25rem' }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </span>
            </div>

            <div className="col-auto d-flex align-items-center gap-1">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => handleRepsChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className={styles['exercise-display-card__reps-input'] || 'form-control text-center'}
                style={{ backgroundColor: '#1a1a1a', color: '#3b82f6', fontSize: '1.15rem', width: '5.5rem', borderRadius: '0.5rem', padding: '0.35rem 0', border: 'none', fontWeight: 700 }}
              />
              {mode === 'time' && <span className="fs-5 fw-bold text-primary ms-1" style={{ color: '#3b82f6' }}>s.</span>}
            </div>
          </div>

          {/* Техническое описание техники выполнения и кнопки Save */}
          <div className="row g-0 align-items-end">
            <div className="col pe-3 text-start">
              <p className={styles['exercise-display-card__description'] || 'small text-muted mb-0'} style={{ fontSize: '12px', fontStyle: 'italic', color: '#cbd5e1', lineHeight: '1.4' }}>
                {exerciseDescription}
              </p>
            </div>

            <div className="col-auto d-flex gap-2">
              <button type="button" className="btn btn-sm btn-secondary px-3 py-2 rounded-3 fw-bold" onClick={() => navigate('/challenges')} style={{ fontSize: '0.85rem' }}>
                Close
              </button>
              <button type="button" className="btn btn-sm btn-primary px-3 py-2 rounded-3 fw-bold" onClick={handleLocalSave} style={{ backgroundColor: '#2563eb', fontSize: '0.85rem' }}>
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Навигационная нижняя панель: стрелочки и кнопка Done */}
        <div className="row g-0 align-items-center justify-content-between mt-4 w-100" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div className="col-auto">
            <button
              type="button"
              className={styles['navigation-arrow-btn'] || 'btn btn-dark'}
              onClick={handlePrevSet}
              disabled={currentSetIndex === 0 || submitting}
              style={{ opacity: currentSetIndex === 0 ? 0.3 : 1 }}
            >
              {"Prev"}
            </button>
          </div>

          <div className="col-6 col-sm-8 px-2">
            {/* ИСПРАВЛЕНО: Добавлено безопасное чтение флага с сервера через ?. */}
            {currentStep?.isFinished ? (
              <div className={styles['completed-badge-custom']}>
                <svg viewBox="0 0 24 24" fill="none" className="me-2 d-inline-block" style={{ width: '1.25rem', height: '1.25rem' }}>
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Completed
              </div>
            ) : (
              <button type="button" className={styles['done-workout-btn-custom']} onClick={handleDoneExercise} disabled={submitting}>
                {submitting ? 'Saving...' : 'Done'}
              </button>
            )}
          </div>



          <div className="col-auto">
            <button
              type="button"
              className={styles['navigation-arrow-btn'] || 'btn btn-dark'}
              onClick={handleNextSet}
              disabled={isLastSet || submitting}
              style={{ opacity: isLastSet ? 0.3 : 1 }}
            >
              {"Next"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
