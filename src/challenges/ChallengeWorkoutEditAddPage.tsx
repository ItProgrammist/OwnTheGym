/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styles from './scss/ChallengeWorkoutEditAddPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ExerciseModal } from '../components/ExerciseModal';
import { ChooseExerciseModal } from '../components/ChooseExerciseModal';

interface ExerciseSet {
  id: number;
  name: string;
  reps: number;
  imageUrl: string;
  description?: string;
}

interface BaseExerciseFromCatalog {
  id: string;
  name: string;
  defaultReps: number;
  imageUrl: string;
}

interface RouterStateLocation {
  workout?: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
    imageUrl: string;
  };
}

export const ChallengeWorkoutEditAddPage: React.FC = () => {
  const { challengeId, workoutId } = useParams<{ challengeId: string; workoutId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as RouterStateLocation;

  // Автозаполнение полей, если мы перешли из режима редактирования конкретного воркаута челленджа
  const [workoutName, setWorkoutName] = useState<string>(routerState?.workout?.title || '');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Insane' | ''>(routerState?.workout?.difficulty || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Состояния для модальных окон (редактирование reps и каталог выбора)
  const [activeSet, setActiveSet] = useState<ExerciseSet | null>(null);
  const [isChooseModalOpen, setIsChooseModalOpen] = useState<boolean>(false);

  // Локальный список подходов (сетов) этой тренировки челленджа
  const [sets, setSets] = useState<ExerciseSet[]>([
    {
      id: 1,
      name: 'Biceps curls with expander',
      reps: 25,
      imageUrl: 'https://unsplash.com',
      description: "This exercise is a real beast. You don't have to worry about your spine so much, it focuses only on biceps."
    },
  ]);

  const handleSaveReps = (newReps: number) => {
    if (!activeSet) return;
    setSets((prevSets) => prevSets.map((item) => (item.id === activeSet.id ? { ...item, reps: newReps } : item)));
  };

  const handleDeleteSet = (id: number) => {
    setSets((prevSets) => prevSets.filter((item) => item.id !== id));
  };

  const handleAddNewExercises = (selectedExercises: BaseExerciseFromCatalog[]) => {
    const updatedSets: ExerciseSet[] = selectedExercises.map((ex, index) => ({
      id: Date.now() + index,
      name: ex.name,
      reps: ex.defaultReps,
      imageUrl: ex.imageUrl,
      description: "Added from exercise catalog."
    }));
    setSets((prev) => [...prev, ...updatedSets]);
  };

  const handleSaveChanges = () => {
    console.log(`=== Сохранение тренировки внутри челленджа: ${challengeId} ===`);
    console.log(`Имя тренировки: ${workoutName}, Сложность: ${difficulty}`);
    console.log(`Список упражнений:`, sets);
    
    // После сохранения возвращаемся обратно к списку тренировок челленджа
    navigate(-1);
  };

  return (
    <div className={styles['workout-edit-page']}>
      <div className={styles['workout-edit-page__content']}>
        <Header />

        {/* Заголовок страницы */}
        <h2 className={styles['workout-edit-page__title']}>
          {workoutId === 'new' ? 'Add Challenge Workout' : 'Edit Challenge Workout'}
        </h2>

        {/* Верхняя панель управления */}
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
              <svg viewBox="0 0 24 24" fill="none" className="ms-2" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="M7 10l5 5 5-5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className={styles['dropdown-menu-list']}>
                <div className={styles['dropdown-item-option']} onClick={() => { setDifficulty('Easy'); setIsDropdownOpen(false); }}>Easy</div>
                <div className={styles['dropdown-item-option']} onClick={() => { setDifficulty('Medium'); setIsDropdownOpen(false); }}>Medium</div>
                <div className={styles['dropdown-item-option']} onClick={() => { setDifficulty('Hard'); setIsDropdownOpen(false); }}>Hard</div>
                <div className={styles['dropdown-item-option']} onClick={() => { setDifficulty('Insane'); setIsDropdownOpen(false); }}>Insane</div>
              </div>
            )}
          </div>

          <div className="col-auto ms-auto">
            <button className={styles['workout-edit-page__add-set-btn']} onClick={() => setIsChooseModalOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Add a Set
            </button>
          </div>
        </div>

        {/* Список подходов упражнений */}
        <div className="d-flex flex-column gap-3 mb-4">
          {sets.map((set) => (
            <div key={set.id} className={styles['exercise-card']}>
              <div className="row g-0 align-items-center w-full h-100">
                <div className="col-auto h-100">
                  <div className={styles['exercise-card__image-wrapper']}>
                    <img src={set.imageUrl} alt={set.name} />
                  </div>
                </div>
                <div className="col ps-3 d-flex flex-column justify-content-center">
                  <h3 className={styles['exercise-card__name']}>{set.name}</h3>
                  <span className={styles['exercise-card__reps']}>x{set.reps}</span>
                </div>
                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                  <button className={styles['exercise-card__action-btn']} onClick={() => handleDeleteSet(set.id)}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                      <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button className={styles['exercise-card__action-btn']} onClick={() => setActiveSet(set)}>
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

        {/* Кнопка сохранения изменений на странице */}
        <button className={styles['workout-edit-page__save-btn']} onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>

      {/* Модалка 1: Детальное изменение reps у сета (три точки) */}
      <ExerciseModal 
        isOpen={activeSet !== null}
        onClose={() => setActiveSet(null)}
        onSave={(updatedData) => handleSaveReps(updatedData.reps)}
        exerciseName={activeSet?.name || ''}
        initialReps={activeSet?.reps || 0}
        description={activeSet?.description || ''}
        videoThumbnail={activeSet?.imageUrl}
      />

      {/* Модалка 2: Выбор новых упражнений каталога (Add a Set) */}
      <ChooseExerciseModal 
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
        onAddExercises={handleAddNewExercises}
      />
      <Footer />
    </div>
  );
};
