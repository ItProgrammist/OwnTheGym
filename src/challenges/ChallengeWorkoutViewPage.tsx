/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './scss/ChallengeWorkoutViewPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ExerciseModal } from '../components/ExerciseModal';
import { ChooseExerciseModal } from '../components/ChooseExerciseModal'; // 1. Импортируем модалку каталога

interface ChallengeExerciseSet {
  id: string;
  name: string;
  imageUrl: string;
  reps: number;
  description: string;
}

interface CatalogExerciseItem {
  id: string;
  name: string;
  defaultReps: number;
  imageUrl: string;
}

interface RouterStateLocation {
  workout?: {
    id: string;
    title: string;
    difficulty: string;
    imageUrl: string;
  };
}

export const ChallengeWorkoutViewPage: React.FC = () => {
  const { challengeId, workoutId } = useParams<{ challengeId: string; workoutId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as RouterStateLocation;

  const workoutTitle = routerState?.workout?.title || "Full Arms";

  const [activeSet, setActiveSet] = useState<ChallengeExerciseSet | null>(null);

  const [isChooseModalOpen, setIsChooseModalOpen] = useState<boolean>(false);

  const [exerciseSets, setExerciseSets] = useState<ChallengeExerciseSet[]>([
    {
      id: 'ch-ex-1',
      name: 'Biceps curls with expander',
      imageUrl: 'https://unsplash.com',
      reps: 25,
      description: "This exercise is a real beast. You don't have to worry about your spine so much, it focuses only on biceps."
    },
    {
      id: 'ch-ex-2',
      name: 'Biceps curls with expander',
      imageUrl: 'https://unsplash.com',
      reps: 20,
      description: "Second set. Maintain strict control on the negative phase of the movement."
    },
    {
      id: 'ch-ex-3',
      name: 'Biceps curls with expander',
      imageUrl: 'https://unsplash.com',
      reps: 15,
      description: "Final set. Push to maximum failure while keeping perfect form."
    },
  ]);

  const handleAddExercisesFromCatalog = (selectedExercises: CatalogExerciseItem[]) => {
    const newSets: ChallengeExerciseSet[] = selectedExercises.map((ex, index) => ({
      id: `ch-ex-${Date.now()}-${index}`,
      name: ex.name,
      imageUrl: ex.imageUrl,
      reps: ex.defaultReps,
      description: "Added to challenge internal workout."
    }));

    setExerciseSets((prev) => [...prev, ...newSets]);
    console.log(`Добавлено упражнений: ${selectedExercises.length} (Воркаут: ${workoutId})`);
  };

  const handleDeleteExercise = (id: string) => {
    setExerciseSets((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveReps = (newReps: number) => {
    if (!activeSet) return;

    setExerciseSets((prevSets) =>
      prevSets.map((item) =>
        item.id === activeSet.id ? { ...item, reps: newReps } : item
      )
    );
  };

  return (
    <div className={styles['challenge-workout-view-page']}>
      <div className={styles['challenge-workout-view-page__content']}>
        
        <Header />

        {/* Навигационная строка */}
        <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
          <div className="col-auto">
            <h2 className={styles['challenge-workout-view-page__title']}>
              {workoutTitle}
            </h2>
          </div>
          
          <div className="col-auto">
            {/* 4. ИСПРАВЛЕНО: Кнопка Add теперь открывает модалку каталога упражнений */}
            <button 
              className={styles['challenge-workout-view-page__add-btn']}
              onClick={() => setIsChooseModalOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Add
            </button>
          </div>
        </div>

        {/* Список подходов упражнений */}
        <div className="d-flex flex-column gap-3">
          {exerciseSets.map((set) => (
            <div key={set.id} className={styles['exercise-row']}>
              <div className="row g-0 align-items-center w-full h-100">
                
                <div className="col-auto h-100">
                  <div className={styles['exercise-row__image-wrapper']}>
                    <img src={set.imageUrl} alt={set.name} />
                  </div>
                </div>

                <div className="col ps-3 d-flex flex-column justify-content-center">
                  <h3 className={styles['exercise-row__name']}>
                    {set.name}
                  </h3>
                  <span className={styles['exercise-row__reps']}>
                    x{set.reps}
                  </span>
                </div>

                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                  <button 
                    className={styles['exercise-row__action-btn']}
                    onClick={() => handleDeleteExercise(set.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                      <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>

                  <button 
                    className={styles['exercise-row__action-btn']}
                    onClick={() => setActiveSet(set)}
                  >
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

      {/* Модалка 1: Детальное редактирование существующего сета (три точки) */}
      <ExerciseModal 
        isOpen={activeSet !== null}
        onClose={() => setActiveSet(null)}
        onSave={(updatedData) => handleSaveReps(updatedData.reps)}
        exerciseName={activeSet?.name || ''}
        initialReps={activeSet?.reps || 0}
        description={activeSet?.description || ''}
        videoThumbnail={activeSet?.imageUrl}
      />

      {/* Модалка 2: Выбор и добавление новых упражнений из каталога (Кнопка Add) */}
      <ChooseExerciseModal 
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
        onAddExercises={handleAddExercisesFromCatalog}
      />

      <Footer />
    </div>
  );
};
