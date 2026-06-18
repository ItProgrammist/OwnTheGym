/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import styles from './scss/ExercisesPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ExerciseModal } from '../components/ExerciseModal';

interface GlobalExerciseItem {
  id: string;
  name: string;
  imageUrl: string;
  reps: number;
  description: string;
}

export const ExercisesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Состояние для открытия модалки и хранения выбранного объекта
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<GlobalExerciseItem | null>(null);

  // Список доступных глобальных упражнений в базе с дефолтными данными
  const [exercises, setExercises] = useState<GlobalExerciseItem[]>([
    {
      id: 'ex-1',
      name: 'Biceps curls with expander',
      imageUrl: 'https://unsplash.com',
      reps: 25,
      description: "This exercise is a real beast. You don't have to worry about your spine so much, it focuses only on biceps."
    },
    {
      id: 'ex-2',
      name: 'Hammer curls',
      imageUrl: 'https://unsplash.com',
      reps: 20,
      description: "Great for building forearm and brachialis thickness. Keep your elbows pinned!"
    },
    {
      id: 'ex-3',
      name: 'Concentration curls',
      imageUrl: 'https://unsplash.com',
      reps: 15,
      description: "Isolates the biceps peak perfectly. Sit down and rest your elbow against your thigh."
    },
  ]);

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Открытие модалки для редактирования существующего упражнения
  const handleOpenDetails = (exercise: GlobalExerciseItem) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  // Открытие модалки для создания НОВОГО упражнения
  const handleOpenCreateModal = () => {
    setSelectedExercise(null); // Явно зануляем объект, чтобы модалка открылась пустой
    setIsModalOpen(true);
  };

  const handleDeleteGlobalExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  // Функция сохранения (умеет и обновлять, и создавать)
  const handleSaveExerciseData = (updatedData: { name: string; reps: number; description: string }) => {
    if (selectedExercise) {
      // РЕЖИМ РЕДАКТИРОВАНИЯ: обновляем поля в существующем элементе
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === selectedExercise.id
            ? { 
                ...ex, 
                name: updatedData.name, 
                reps: updatedData.reps, 
                description: updatedData.description 
              }
            : ex
        )
      );
    } else {
      // РЕЖИМ СОЗДАНИЯ: собираем новый объект и добавляем в массив
      const newExercise: GlobalExerciseItem = {
        id: `ex-${Date.now()}`, // Генерируем уникальный строковый ID
        name: updatedData.name || 'Unnamed Exercise',
        imageUrl: 'https://unsplash.com', // Дефолтное изображение заглушки
        reps: updatedData.reps || 0,
        description: updatedData.description || ''
      };
      
      setExercises((prev) => [...prev, newExercise]);
    }
  };

  return (
    <div className={styles['exercises-page']}>
      <div className={styles['exercises-page__content']}>
        
        <Header />

        <div className="row g-0 align-items-center justify-content-between mb-4 px-1 gap-2">
          <div className="col-auto">
            <h2 className={styles['exercises-page__title']}>Exercises</h2>
          </div>
          
          <div className="col col-sm-4 position-relative">
            <input 
              type="text" 
              placeholder="Search an exercise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles['exercises-page__search-input']}
            />
            <span className={styles['exercises-page__search-icon']}>
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="6" stroke="#3b82f6" strokeWidth="2.5"/>
                <path d="M16 16l4 4" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </span>
          </div>

          {/* ИСПРАВЛЕНО: Кнопка Add теперь имеет обработчик onClick и вызывает handleOpenCreateModal */}
          <div className="col-auto">
            <button 
              className={styles['exercises-page__add-btn']}
              onClick={handleOpenCreateModal}
            >
              <svg viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Add
            </button>
          </div>
        </div>

        {/* Список карточек */}
        <div className="d-flex flex-column gap-3">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className={styles['exercise-row']}>
              <div className="row g-0 align-items-center w-full h-100">
                
                <div className="col-auto h-100">
                  <div className={styles['exercise-row__image-wrapper']}>
                    <img src={exercise.imageUrl} alt={exercise.name} />
                  </div>
                </div>

                <div className="col ps-3 d-flex align-items-center">
                  <h3 className={styles['exercise-row__name']}>{exercise.name}</h3>
                </div>

                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                  <button 
                    className={styles['exercise-row__action-btn']}
                    onClick={() => handleDeleteGlobalExercise(exercise.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                      <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>

                  <button 
                    className={styles['exercise-row__action-btn']}
                    onClick={() => handleOpenDetails(exercise)}
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

      {/* Подключаем модалку вниз страницы */}
      <ExerciseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExerciseData}
        exerciseName={selectedExercise?.name || ''} // Если создаем новое, подставится пустая строка
        initialReps={selectedExercise?.reps || 0}   // Если создаем новое, подставится 0
        description={selectedExercise?.description || ''}
        videoThumbnail={selectedExercise?.imageUrl || 'https://unsplash.com'}
      />

      <Footer />
    </div>
  );
};
