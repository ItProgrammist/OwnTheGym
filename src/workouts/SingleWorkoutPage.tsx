/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './scss/SingleWorkoutPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ExerciseModal } from '../components/ExerciseModal'; // 1. Импортируем модалку

interface ExerciseItem {
    id: number;
    name: string;
    reps: number;
    imageUrl: string;
    description?: string; // Опциональное описание для модалки
}

export const SingleWorkoutPage: React.FC = () => {
    const { workoutId } = useParams<{ workoutId: string }>();
    const navigate = useNavigate();

    // 2. Стейт для хранения выбранного упражнения (изначально null — модалка закрыта)
    const [activeExercise, setActiveExercise] = useState<ExerciseItem | null>(null);

    // Динамические упражнения (добавили дефолтные описания)
    const [exercises, setExercises] = useState<ExerciseItem[]>([
        {
            id: 1,
            name: 'Biceps curls with expander',
            reps: 25,
            imageUrl: 'https://unsplash.com',
            description: "This exercise is a real beast. You don't have to worry about your spine so much, it focuses only on biceps."
        },
        {
            id: 2,
            name: 'Hammer curls',
            reps: 20,
            imageUrl: 'https://unsplash.com',
            description: "Great for building forearm and brachialis thickness. Keep your elbows pinned!"
        },
        {
            id: 3,
            name: 'Concentration curls',
            reps: 15,
            imageUrl: 'https://unsplash.com',
            description: "Isolates the biceps peak perfectly. Sit down and rest your elbow against your thigh."
        },
    ]);

    const workoutTitle = workoutId === 'arms-killer' ? 'Arms Killer' : 'Chest Mission';

    // 3. Функция сохранения измененных повторений из модалки
    const handleSaveReps = (newReps: number) => {
        if (!activeExercise) return;

        // Обновляем количество повторений в общем массиве стейта
        setExercises(prevExercises =>
            prevExercises.map(ex =>
                ex.id === activeExercise.id ? { ...ex, reps: newReps } : ex
            )
        );

        console.log(`Повторения для ${activeExercise.name} изменены на: ${newReps}`);
    };

    return (
        <div className={styles['workout-view-page']}>
            <div className={styles['workout-view-page__content']}>
                <Header />

                <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
                    <div className="col-auto">
                        <h2 className={styles['workout-view-page__title']}>{workoutTitle}</h2>
                    </div>
                    <div className="col-auto d-flex align-items-center gap-2">
                        <button className={styles['workout-view-page__control-btn']} onClick={() => navigate(`/workouts/${workoutId}/edit`)}>
                            <svg viewBox="0 0 24 24" fill="none">
                                <rect width="24" height="24" rx="4" fill="#2563eb" />
                                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className={styles['workout-view-page__control-btn']}>
                            <svg viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="11" fill="#fca5a5" />
                                <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Список упражнений */}
                <div className="d-flex flex-column gap-3 mb-4">
                    {exercises.map((item) => (
                        <div key={item.id} className={styles['exercise-row']}>
                            <div className="row g-0 align-items-center w-full h-100">
                                <div className="col-auto h-100">
                                    <div className={styles['exercise-row__image-wrapper']}>
                                        <img src={item.imageUrl} alt={item.name} />
                                    </div>
                                </div>

                                <div className="col ps-3 d-flex flex-column justify-content-center">
                                    <h3 className={styles['exercise-row__name']}>{item.name}</h3>
                                    <span className={styles['exercise-row__reps']}>x{item.reps}</span>
                                </div>

                                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                                    <div className={styles['exercise-row__status-icon']}>
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                                            <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>

                                    {/* 4. КНОПКА ТРИ ТОЧКИ: При клике передаем весь объект упражнения в стейт */}
                                    <button
                                        className={styles['exercise-row__action-btn']}
                                        onClick={() => setActiveExercise(item)}
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

                <button
                    className={styles['workout-view-page__start-btn']}
                    onClick={() => navigate(`/workouts/${workoutId}/active`)}
                >
                    Start Workout
                </button>
            </div>

            {/* 5. ПОДКЛЮЧАЕМ МОДАЛКУ ВНИЗУ И ПЕРЕДАЕМ ДАННЫЕ ИЗ СТЕЙТА */}
            <ExerciseModal
                isOpen={activeExercise !== null}                 // Открыта, если в стейте что-то есть
                onClose={() => setActiveExercise(null)}          // Закрытие зануляет стейт
                onSave={handleSaveReps}                          // Передаем функцию сохранения
                exerciseName={activeExercise?.name || ''}        // Имя выбранного упражнения
                initialReps={activeExercise?.reps || 0}          // Повторения выбранного упражнения
                description={activeExercise?.description}        // Описание выбранного упражнения
                videoThumbnail={activeExercise?.imageUrl}        // Картинка выбранного упражнения
            />

            <Footer />
        </div>
    );
};
