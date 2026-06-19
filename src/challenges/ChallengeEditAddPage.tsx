/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styles from './scss/ChallengeEditAddPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface ChallengeWorkoutItem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
    imageUrl: string;
}

interface RouterStateLocation {
    challenge?: {
        id: string;
        title: string;
        difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
        imageUrl: string;
    };
}

export const ChallengeEditAddPage: React.FC = () => {
    const { challengeId } = useParams<{ challengeId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const routerState = location.state as RouterStateLocation;

    // 1. АВТОПОДСТАНОВКА: подтягиваем имя и сложность челленджа из истории переходов
    const [challengeName, setChallengeName] = useState<string>(routerState?.challenge?.title || '');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Insane' | ''>(routerState?.challenge?.difficulty || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    // Список внутренних тренировок этого челленджа
    const [internalWorkouts, setInternalWorkouts] = useState<ChallengeWorkoutItem[]>(
        challengeId === 'new'
            ? [] // Пустой массив для режима создания
            : [  // Дефолтные тренировки только для режима редактирования
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
            ]
    );

    const getDifficultyClass = (diff: 'Easy' | 'Medium' | 'Hard' | 'Insane') => {
        if (diff === 'Medium') return styles['workout-card__difficulty--medium'];
        if (diff === 'Hard') return styles['workout-card__difficulty--hard'];
        return styles['workout-card__difficulty--insane'];
    };

    // 2. ПЕРЕХОД НА СОЗДАНИЕ ВОРКАУТА ЧЕЛЛЕНДЖА
    const handleNavigateToCreateWorkout = () => {
        navigate(`/challenges/${challengeId || 'new'}/workouts/new/edit`);
    };

    // 3. ПЕРЕХОД НА РЕДАКТИРОВАНИЕ ВОРКАУТА ЧЕЛЛЕНДЖА С АВТОПОДТАНОВКОЙ ДАННЫХ
    const handleNavigateToEditWorkout = (e: React.MouseEvent, workout: ChallengeWorkoutItem) => {
        e.stopPropagation(); // Изолируем клик, чтобы не было конфликтов

        // Переходим на ChallengeWorkoutEditAddPage и принудительно прокидываем весь объект воркаута в state
        navigate(`/challenges/${challengeId || 'new'}/workouts/${workout.id}/edit`, {
            state: { workout: workout }
        });
    };

    const handleDeleteWorkout = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setInternalWorkouts((prev) => prev.filter((item) => item.id !== id));
    };

    const handleSelectDifficulty = (value: 'Easy' | 'Medium' | 'Hard' | 'Insane') => {
        setDifficulty(value);
        setIsDropdownOpen(false);
    };

    const handleSaveChallengeChanges = () => {
        console.log(`=== Изменения челленджа успешно сохранены ===`);
        navigate(-1);
    };

    return (
        <div className={styles['challenge-edit-page']}>
            <div className={styles['challenge-edit-page__content']}>
                <Header />

                {/* Заголовок страницы */}
                <h2 className={styles['challenge-edit-page__title']}>
                    {challengeId === 'new' ? 'Add New Challenge' : 'Edit Challenge'}
                </h2>

                {/* Верхняя панель управления */}
                <div className="row g-0 align-items-center mb-4 px-1 gap-2 gap-sm-3 position-relative">
                    <div className="col-auto">
                        <div className={styles['challenge-edit-page__edit-icon-btn']}>
                            <svg viewBox="0 0 24 24" fill="none">
                                <rect width="24" height="24" rx="4" fill="#2563eb" />
                                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Инпут Названия челленджа */}
                    <div className="col col-sm-3">
                        <input
                            type="text"
                            value={challengeName}
                            onChange={(e) => setChallengeName(e.target.value)}
                            placeholder="Challenge Name..."
                            className={styles['challenge-edit-page__input']}
                        />
                    </div>

                    {/* Дропдаун Сложности челленджа */}
                    <div className="col col-sm-4 position-relative">
                        <div className={styles['challenge-edit-page__dropdown']} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            <span>{difficulty ? difficulty : 'Choose the diff...'}</span>
                            <svg viewBox="0 0 24 24" fill="none" className="ms-2" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                <path d="M7 10l5 5 5-5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {isDropdownOpen && (
                            <div className={styles['dropdown-menu-list']}>
                                <div className={styles['dropdown-item-option']} onClick={() => handleSelectDifficulty('Easy')}>Easy</div>
                                <div className={styles['dropdown-item-option']} onClick={() => handleSelectDifficulty('Medium')}>Medium</div>
                                <div className={styles['dropdown-item-option']} onClick={() => handleSelectDifficulty('Hard')}>Hard</div>
                                <div className={styles['dropdown-item-option']} onClick={() => handleSelectDifficulty('Insane')}>Insane</div>
                            </div>
                        )}
                    </div>

                    {/* Кнопка Add a Workout — ведет на ChallengeWorkoutEditAddPage */}
                    <div className="col-auto ms-auto">
                        <button
                            className={styles['challenge-edit-page__add-workout-btn']}
                            onClick={handleNavigateToCreateWorkout}
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="me-2">
                                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                            Add a Workout
                        </button>
                    </div>
                </div>

                {/* Список вложенных тренировок челленджа */}
                <div className="d-flex flex-column gap-3 mb-4">
                    {internalWorkouts.map((workout) => (
                        <div key={workout.id} className={styles['workout-card']}>
                            <div className="row g-0 align-items-center w-full h-100">
                                <div className="col-auto h-100">
                                    <div className={styles['workout-card__image-wrapper']}>
                                        <img src={workout.imageUrl} alt={workout.title} />
                                    </div>
                                </div>
                                <div className="col ps-3 d-flex flex-column justify-content-center">
                                    <h3 className={styles['workout-card__name']}>{workout.title}</h3>
                                    <p className={styles['workout-card__difficulty-label']}>
                                        Difficulty:{' '}
                                        <span className={getDifficultyClass(workout.difficulty)}>
                                            {workout.difficulty}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-auto pe-3 d-flex align-items-center gap-2">
                                    {/* Кнопка удаления */}
                                    <button className={styles['workout-card__action-btn']} onClick={(e) => handleDeleteWorkout(e, workout.id)}>
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                                            <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>

                                    {/* ИСПРАВЛЕНО: Заменили три точки на синий карандаш, ведущий на ChallengeWorkoutEditAddPage */}
                                    <button
                                        className={styles['workout-card__action-btn']}
                                        onClick={(e) => handleNavigateToEditWorkout(e, workout)}
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

                {/* Большая синяя кнопка сохранения */}
                <button className={styles['challenge-edit-page__save-btn']} onClick={handleSaveChallengeChanges}>
                    Save Changes
                </button>
            </div>

            <Footer />
        </div>
    );
};
