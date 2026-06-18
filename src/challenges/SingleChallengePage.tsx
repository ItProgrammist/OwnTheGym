/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './scss/SingleChallengePage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface ChallengeWorkoutItem {
    id: string;
    title: string;
    difficulty: 'Medium' | 'Hard' | 'Insane';
    imageUrl: string;
}

export const SingleChallengePage: React.FC = () => {
    const { challengeId } = useParams<{ challengeId: string }>();
    const navigate = useNavigate();

    // Заголовок конкретного челленджа (подтягивается из базы по ID)
    const challengeTitle = "ARM WAR AND STAMINA Challenge";

    // Локальный список тренировок, которые создаются ВНУТРИ этого челленджа
    const [internalWorkouts, setInternalWorkouts] = useState<ChallengeWorkoutItem[]>([
        {
            id: 'ch-w-1',
            title: 'Full arms',
            difficulty: 'Medium',
            imageUrl: 'https://unsplash.com',
        },
        {
            id: 'ch-w-2',
            title: 'Pull ups cardio (biceps)',
            difficulty: 'Insane',
            imageUrl: 'https://unsplash.com',
        },
        {
            id: 'ch-w-3',
            title: 'Full Arms Static',
            difficulty: 'Hard',
            imageUrl: 'https://unsplash.com',
        },
    ]);

    const getDifficultyClass = (diff: 'Medium' | 'Hard' | 'Insane') => {
        if (diff === 'Medium') return styles['challenge-workout__difficulty--medium'];
        if (diff === 'Hard') return styles['challenge-workout__difficulty--hard'];
        return styles['challenge-workout__difficulty--insane'];
    };

    const handleAddInternalWorkout = () => {
        console.log('Создание новой тренировки внутри этого челленджа');
    };

    const handleDeleteInternalWorkout = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setInternalWorkouts((prev) => prev.filter((item) => item.id !== id));
    };

    const handleEditInternalWorkout = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        // Переход на конструктор/редактор этой внутренней тренировки челленджа
        navigate(`/challenges/${challengeId}/workouts/${id}/edit`);
    };

    return (
        <div className={styles['single-challenge-page']}>
            <div className={styles['single-challenge-page__content']}>

                {/* Кликабельный верхний логотип */}
                <Header />

                {/* Навигационная панель: Кастомное имя челленджа + кнопка Add */}
                <div className="row g-0 align-items-center justify-content-between mb-4 px-1 gap-2">
                    <div className="col-12 col-sm-8">
                        <h2 className={styles['single-challenge-page__title']}>
                            {challengeTitle}
                        </h2>
                    </div>

                    <div className="col-auto ms-sm-auto">
                        <button
                            className={styles['single-challenge-page__add-btn']}
                            onClick={handleAddInternalWorkout}
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="me-2">
                                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                            Add
                        </button>
                    </div>
                </div>

                {/* Список вложенных тренировок испытания */}
                <div className="d-flex flex-column gap-3">
                    {internalWorkouts.map((workout) => (
                        <div
                            key={workout.id}
                            className={styles['challenge-workout']}
                            /* ИСПРАВЛЕНО: При клике передаем весь объект workout в state навигации */
                            onClick={() => navigate(`/challenges/${challengeId}/workouts/${workout.id}`, { state: { workout } })}
                        >
                            <div className="row g-0 align-items-center w-full h-100">

                                {/* Картинка-превью */}
                                <div className="col-auto h-100">
                                    <div className={styles['challenge-workout__image-wrapper']}>
                                        <img src={workout.imageUrl} alt={workout.title} />
                                    </div>
                                </div>

                                {/* Название + Сложность */}
                                <div className="col ps-3 d-flex flex-column justify-content-center">
                                    <h3 className={styles['challenge-workout__title']}>{workout.title}</h3>
                                    <p className={styles['challenge-workout__difficulty-label']}>
                                        Difficulty:{' '}
                                        <span className={getDifficultyClass(workout.difficulty)}>
                                            {workout.difficulty}
                                        </span>
                                    </p>
                                </div>

                                {/* Кнопки действий */}
                                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                                    <button
                                        className={styles['challenge-workout__action-btn']}
                                        onClick={(e) => handleDeleteInternalWorkout(e, workout.id)}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                                            <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>

                                    <button
                                        className={styles['challenge-workout__action-btn']}
                                        onClick={(e) => handleEditInternalWorkout(e, workout.id)}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <rect x="2" y="2" width="20" height="20" rx="4" fill="#1d4ed8" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1.5" />
                                            <path d="M7 17l2.5.5L17 10l-3-3-7.5 7.5L7 17zM13 8l3 3" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>


            </div>

            {/* Глобальный таб-бар с активной иконкой Кубка по макету */}
            <Footer />
        </div>
    );
};
