/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './scss/ChallengeWorkoutEditAddPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ExerciseModal } from '../components/ExerciseModal';
import { ChooseExerciseModal } from '../components/ChooseExerciseModal';
import { workoutService, type WorkoutItem, type WorkoutLevel, type WorkoutSetPost } from '../api/workoutService';

interface LocalExerciseSet {
  id: string;
  exerciseId: string;
  name: string;
  reps: number;
  time: number;
}

export const ChallengeWorkoutEditAddPage: React.FC = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as { workout?: WorkoutItem; forcedType?: string };

  const [workoutName, setWorkoutName] = useState<string>(routerState?.workout?.title || '');
  const [difficulty, setDifficulty] = useState<WorkoutLevel | ''>(
    (routerState?.workout?.level?.toUpperCase() as WorkoutLevel) || ''
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isChooseModalOpen, setIsChooseModalOpen] = useState<boolean>(false);
  const [activeSet, setActiveSet] = useState<LocalExerciseSet | null>(null);

  // Подгружаем существующие сеты тренировки, если мы в режиме редактирования
  const [sets, setSets] = useState<LocalExerciseSet[]>(
    routerState?.workout?.sets.map((s, index) => ({
      id: s.id || `set-${Date.now()}-${index}`,
      exerciseId: s.exerciseId,
      name: s.exerciseTitle || 'Упражнение',
      reps: s.numberOfReps || 0,
      time: s.amountOfTime || 0,
    })) || []
  );

  const handleDeleteSet = (id: string) => {
    setSets((prev) => prev.filter((item) => item.id !== id));
  };

  // ИСПРАВЛЕНО: Снята ошибка ts(2322) типизации аргумента модалки
  const handleAddNewExercises = (selectedExercises: any[]) => {
    const updatedSets: LocalExerciseSet[] = selectedExercises.map((ex, index) => ({
      id: `new-set-${Date.now()}-${index}`,
      exerciseId: ex.id,
      name: ex.title || ex.name,
      reps: 10,
      time: 0,
    }));
    setSets((prev) => [...prev, ...updatedSets]);
  };

  // ИСПРАВЛЕНО: Реальная сетевая отправка с принудительным сохранением type SPECIAL
  const handleSaveChanges = async () => {
    // ЛОГ 1: Старт функции и проверка стейта
    console.log('%c=== [ЛОГ 1] КЛИК НА SAVE CHANGES ===', 'color: #3b82f6; font-weight: bold;');
    console.log('Текущее имя тренировки:', workoutName);
    console.log('Выбранная сложность:', difficulty);
    console.log('Локальные сеты (sets):', sets);

    if (!workoutName.trim() || !difficulty) {
      alert('Пожалуйста, введите название и выберите сложность.');
      return;
    }
    if (sets.length === 0) {
      alert('Добавьте хотя бы одно упражнение в тренировку.');
      return;
    }

    const formattedSets = sets.map((s) => ({
      exerciseId: s.exerciseId,
      numberOfReps: parseInt(String(s.reps), 10) || 0,
      amountOfTime: parseInt(String(s.time), 10) || 0
    }));

    // ЛОГ 2: Проверяем, что прилетело в объект истории роутера (location.state)
    console.log('%c=== [ЛОГ 2] ПРОВЕРКА СОСТОЯНИЯ РОУТЕРА (state) ===', 'color: #a855f7; font-weight: bold;');
    console.log('Полный объект location.state:', location.state);

    const parentChallenge = (location.state as any)?.parentChallenge;
    console.log('Извлеченный parentChallenge:', parentChallenge);

    const fromChallengeId = parentChallenge?.id;
    console.log('Извлеченный ID родительского челленджа (fromChallengeId):', fromChallengeId);

    const isSpecial = routerState?.forcedType === 'SPECIAL' || routerState?.workout?.type === 'SPECIAL' || !!fromChallengeId;

    const payload = {
      title: workoutName.trim(),
      description: isSpecial ? 'Challenge special workout session' : 'Custom typical workout session',
      level: difficulty,
      type: isSpecial ? ('SPECIAL' as const) : ('TYPICAL' as const),
      sets: formattedSets
    };

    try {
      // ЛОГ 3: Отправка запроса на создание воркаута
      console.log('%c=== [ЛОГ 3] ОТПРАВКА POST /workouts ===', 'color: #eab308; font-weight: bold;');
      console.log('Тело запроса воркаута (payload):', JSON.stringify(payload, null, 2));

      const savedWorkout = await workoutService.createWorkout(payload);

      console.log('%cУспешно создан воркаут в базе! Сгенерированный ID:', 'color: #22c55e;', savedWorkout.id);

      // ЛОГ 4: Проверка условий перед отправкой PUT-запроса челленджа
      console.log('%c=== [ЛОГ 4] ПРОВЕРКА ПЕРЕД ПРИВЯЗКОЙ К ЧЕЛЛЕНДЖУ ===', 'color: #f43f5e; font-weight: bold;');
      console.log('parentChallenge существует?:', !!parentChallenge);
      console.log('fromChallengeId существует?:', !!fromChallengeId);
      console.log('fromChallengeId равен new?:', fromChallengeId === 'new');

      if (parentChallenge && fromChallengeId && fromChallengeId !== 'new') {
        const oldWorkoutIds = parentChallenge.workoutIds || [];
        console.log('Старые ID тренировок в памяти челленджа (oldWorkoutIds):', oldWorkoutIds);

        const finalWorkoutIds = [...oldWorkoutIds, savedWorkout.id];
        console.log('Итоговый объединенный массив ID для отправки (finalWorkoutIds):', finalWorkoutIds);

        const challengePayload = {
          title: parentChallenge.title || 'string',
          description: parentChallenge.description || 'string',
          imageUrl: parentChallenge.imageUrl || 'string',
          workoutIds: finalWorkoutIds
        };

        // ЛОГ 5: Финальный JSON-пакет для PUT-запроса челленджа
        console.log('%c=== [ЛОГ 5] СЕТЕВОЙ ЗАПРОС PUT /challenges/{id} ===', 'color: #22c55e; font-weight: bold;');
        console.log(`URL: /challenges/${fromChallengeId}`);
        console.log('Тело запроса челленджа (challengePayload):', JSON.stringify(challengePayload, null, 2));

        const challengeResult = await workoutService.updateChallenge(fromChallengeId, challengePayload);
        console.log('%c[УСПЕХ] Бэкенд принял PUT-запрос! Ответ сервера:', 'color: #22c55e;', challengeResult);
      } else {
        console.warn('%c⚠️ [ПРЕДУПРЕЖДЕНИЕ] Условие привязки не выполнено. PUT-запрос к челленджу НЕ улетел!', 'color: #ff9800; font-weight: bold;');
      }

      navigate(-1);
    } catch (err: unknown) {
      console.error('%c=== [КРИТИЧЕСКАЯ ОШИБКА В ЦЕПОЧКЕ ЗАПРОСОВ] ===', 'color: #ef4444; font-weight: bold;', err);
      if (axios.isAxiosError(err)) {
        console.log('Статус ошибки сервера:', err.response?.status);
        console.log('Детали ошибки сервера (Data):', err.response?.data);
      }
      alert('Ошибка при сохранении воркаута или привязке к челленджу. Проверьте консоль F12.');
    }
  };




  return (
    <div className="w-100 min-vh-100 text-white d-flex flex-column" style={{ backgroundColor: '#1a1a1a', fontFamily: 'sans-serif' }}>
      <div className="container flex-grow-1 py-4 px-3 d-flex flex-column align-items-center" style={{ maxWidth: '640px' }}>
        <Header />

        <h2 className="fs-3 fw-bold my-4 text-start w-100 px-1 text-white">
          {workoutId === 'new' ? 'Add New Workout' : 'Edit Workout'}
        </h2>

        {/* ПАНЕЛЬ УПРАВЛЕНИЯ ПИКСЕЛЬ В ПИКСЕЛЬ С МАКЕТА С КНОПКОЙ ADD A SET */}
        <div className="d-flex align-items-center mb-4 w-100 px-1 position-relative gap-2">
          <div className="d-flex align-items-center justify-content-center bg-primary rounded-3" style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#2563eb' }}>
            <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.25rem', height: '1.25rem' }}>
              <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div style={{ width: '13.5rem' }}>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Workout Name..."
              className="form-control border-0 text-white placeholder-secondary"
              style={{ backgroundColor: '#2d2d2d', borderRadius: '0.75rem', padding: '0.5rem 1rem' }}
            />
          </div>

          <div className="position-relative" style={{ width: '12rem' }}>
            <div
              className="d-flex align-items-center justify-content-between text-secondary px-3 py-2"
              style={{ backgroundColor: '#2d2d2d', borderRadius: '0.75rem', cursor: 'pointer' }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className={difficulty ? 'text-white' : 'text-secondary'}>
                {difficulty ? difficulty : 'Choose the diff...'}
              </span>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: '1rem', height: '1rem' }}><path d="M7 10l5 5 5-5" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            {isDropdownOpen && (
              <div className="position-absolute w-100 rounded-3 mt-1 p-1 shadow-lg" style={{ backgroundColor: '#333', zIndex: 100 }}>
                {(['EASY', 'MEDIUM', 'HARD', 'INSANE'] as WorkoutLevel[]).map((lvl) => (
                  <div
                    key={lvl}
                    className="px-3 py-2 rounded-2 text-white"
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setDifficulty(lvl); setIsDropdownOpen(false); }}
                  >
                    {lvl}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-transparent d-flex align-items-center gap-2 fw-semibold p-0 text-white border-0"
              onClick={() => setIsChooseModalOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.4rem', height: '1.4rem' }}>
                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Add a Set
            </button>
          </div>
        </div>

        {/* СПИСОК УПРАЖНЕНИЙ ТРЕНИРОВКИ */}
        <div className="d-flex flex-column gap-3 mb-4 w-100">
          {sets.map((set) => (
            <div key={set.id} className="card border-0 rounded-4 overflow-hidden text-white shadow-sm w-100" style={{ backgroundColor: '#2d2d2d', height: '5rem' }}>
              <div className="row g-0 align-items-center h-100 w-100 px-3">
                <div className="col-auto h-100 d-flex align-items-center">
                  <div className="rounded-3 overflow-hidden bg-black d-flex align-items-center justify-content-center" style={{ width: '4rem', height: '3.25rem' }}>
                    <img src="/placeholder.png" alt={set.name} className="w-100 h-100 object-fit-cover" />
                  </div>
                </div>
                <div className="col ps-3 d-flex flex-column justify-content-center text-start">
                  <h3 className="fs-5 fw-bold mb-0 text-white">{set.name}</h3>
                  <span className="text-primary small fw-semibold mt-1">
                    {set.time > 0 ? `${set.time} s.` : `x${set.reps}`}
                  </span>
                </div>
                <div className="col-auto d-flex align-items-center gap-2">
                  <button type="button" className="btn p-0 border-0 bg-transparent" onClick={() => handleDeleteSet(set.id)}>
                    <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.5rem' }}><circle cx="12" cy="12" r="10" fill="#fca5a5" /><path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /></svg>
                  </button>
                  <button type="button" className="btn p-0 border-0 bg-transparent" onClick={() => setActiveSet(set)}>
                    <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.5rem' }}><circle cx="12" cy="12" r="10" fill="#2563eb" /><circle cx="8" cy="12" r="1" fill="white" /><circle cx="12" cy="12" r="1" fill="white" /><circle cx="16" cy="12" r="1" fill="white" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* БОЛЬШАЯ СИНЯЯ КНОПКА SAVE CHANGES */}
        <button
          type="button"
          className="btn btn-primary w-100 py-3 rounded-4 fw-bold fs-5 border-0 text-white shadow"
          onClick={handleSaveChanges}
          style={{ backgroundColor: '#2563eb', marginTop: 'auto', marginBottom: '4rem' }}
        >
          Save Changes
        </button>
      </div>

      <ExerciseModal
        isOpen={activeSet !== null}
        onClose={() => setActiveSet(null)}
        exerciseName={activeSet?.name || ''}
        initialReps={activeSet?.reps || 0}
        initialTime={activeSet?.time || 0}
        description=""
        onSave={async (updatedData) => {
          if (!activeSet) return;
          setSets((prev) =>
            prev.map((item) =>
              item.id === activeSet.id ? { ...item, reps: Number(updatedData.reps), time: Number(updatedData.time) } : item
            )
          );
        }}
      />

      <ChooseExerciseModal
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
        onAddExercises={handleAddNewExercises}
      />
      <Footer />
    </div>
  );

};
