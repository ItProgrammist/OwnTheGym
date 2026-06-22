/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './scss/SingleChallengePage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { workoutService, type ChallengeItem, type WorkoutItem } from '../api/workoutService';

export const SingleChallengePage: React.FC = () => {
    const { challengeId } = useParams<{ challengeId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const routerState = location.state as { challenge?: ChallengeItem };

    const [challenge, setChallenge] = useState<ChallengeItem | null>(routerState?.challenge || null);
    const [loading, setLoading] = useState<boolean>(!challenge);

    // Подтягиваем свежие данные челленджа с бэка при F5 или отсутствии state
    useEffect(() => {
        if (challengeId && !routerState?.challenge) {
            setLoading(true);
            workoutService.getAllChallenges()
                .then((list) => {
                    const found = list.find((c) => c.id === challengeId);
                    if (found) setChallenge(found);
                })
                .catch((err) => console.error('Ошибка при загрузке челленджа:', err))
                .finally(() => setLoading(false));
        }
    }, [challengeId, routerState]);

    // Удаление воркаута ИМЕННО из этого челленджа (Обновление массива на бэке)
    const handleDeleteWorkoutFromChallenge = async (workoutId: string) => {
        if (!challenge || !challengeId || !window.confirm('Отвязать эту тренировку от челленджа?')) return;

        const updatedWorkouts = (challenge.workouts || []).filter((w) => w.id !== workoutId);

        const payload = {
            title: challenge.title,
            description: challenge.description,
            imageUrl: challenge.imageUrl || 'string',
            workouts: updatedWorkouts.map((w) => ({ id: w.id })),
            workoutIds: updatedWorkouts.map((w) => w.id)
        };

        try {
            const refreshedChallenge = await workoutService.updateChallenge(challengeId, payload);
            setChallenge(refreshedChallenge);
        } catch (err) {
            alert('Не удалось обновить список тренировок на сервере.');
        }
    };

    if (loading) return <div className="text-center text-white mt-5">Загрузка деталей челленджа...</div>;
    if (!challenge) return <div className="text-center text-white mt-5">Челлендж не найден.</div>;

    return (
        <div className="w-100 min-vh-100 text-white d-flex flex-column" style={{ backgroundColor: '#1a1a1a', fontFamily: 'sans-serif' }}>
            <div className="container flex-grow-1 py-4 d-flex flex-column align-items-center" style={{ maxWidth: '640px' }}>
                <Header />

                {/* ШАПКА: НАЗВАНИЕ ЧЕЛЛЕНДЖА + КНОПКА ADD */}
                <div className="d-flex align-items-center justify-content-between mb-4 mt-2 w-100 px-1">
                    <h2 className="fs-3 fw-bold m-0 text-white">{challenge.title || 'Challenge'}</h2>

                    <button
                        type="button"
                        className="btn btn-success d-flex align-items-center gap-2 fw-semibold px-3 py-2 border-0 shadow-sm"
                        style={{ backgroundColor: '#22c55e', borderRadius: '0.75rem' }}
                        onClick={() => {
                            // Собираем слепок текущего челленджа, чтобы конструктор воркаутов его запомнил
                            const currentChallengeSnapshot = {
                                id: challengeId,
                                title: challenge.title,
                                description: challenge.description,
                                imageUrl: challenge.imageUrl,
                                // Запоминаем ID всех тренировок, которые СЕЙЧАС уже привязаны к этому челленджу
                                workoutIds: challenge.workouts?.map(w => w.id) || []
                            };

                            console.log('Переходим в конструктор, передаем контекст челленджа:', currentChallengeSnapshot);

                            // Перенаправляем в конструктор, передавая слепок в parentChallenge
                            navigate('/workouts/new/edit', {
                                state: {
                                    forcedType: 'SPECIAL',
                                    parentChallenge: currentChallengeSnapshot
                                }
                            });
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.25rem', height: '1.25rem' }}>
                            <circle cx="12" cy="12" r="11" fill="none" stroke="white" strokeWidth="2.5" />
                            <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        Add
                    </button>

                </div>

                {/* СПИСОК СПЕЦИАЛЬНЫХ ТРЕНИРОВОК ЭТОГО ЧЕЛЛЕНДЖА */}
                <div className="d-flex flex-column gap-3 w-100 mb-4">
                    {(!challenge.workouts || challenge.workouts.length === 0) && (
                        <div className="text-center text-secondary py-5 rounded-4" style={{ backgroundColor: '#2d2d2d' }}>
                            В этом челлендже пока нет тренировок. Нажмите Add, чтобы создать.
                        </div>
                    )}

                    {challenge.workouts?.map((item) => {
                        if (!item) return null;
                        return (
                            <div
                                key={item.id}
                                className="card border-0 rounded-4 overflow-hidden text-white shadow-sm w-100"
                                style={{ backgroundColor: '#2d2d2d', height: '5.5rem' }}
                            >
                                <div className="row g-0 align-items-center h-100 w-100 px-3">

                                    {/* Миниатюра-превью воркаута */}
                                    <div className="col-auto h-100 d-flex align-items-center">
                                        <div className="rounded-3 overflow-hidden bg-black d-flex align-items-center justify-content-center" style={{ width: '4.5rem', height: '3.75rem' }}>
                                            <img src="/placeholder.png" alt={item.title} className="w-100 h-100 object-fit-cover" />
                                        </div>
                                    </div>

                                    {/* Текстовые поля: Название и Уровень сложности */}
                                    <div className="col ps-3 d-flex flex-column justify-content-center text-start">
                                        <h3 className="fs-5 fw-bold mb-1 text-white text-truncate" style={{ maxWidth: '260px' }}>
                                            {item.title}
                                        </h3>
                                        <span className="small text-muted">
                                            Difficulty: <strong style={{ color: item.level === 'HARD' || item.level === 'INSANE' ? '#a855f7' : '#eab308' }}>{item.level}</strong>
                                        </span>
                                    </div>

                                    {/* КНОПКИ УПРАВЛЕНИЯ КАРТОЧКОЙ ВОРКАУТА */}
                                    <div className="col-auto d-flex align-items-center gap-2">
                                        {/* Красный крестик удаления/отвязки */}
                                        <button
                                            type="button"
                                            className="btn p-0 border-0 bg-transparent"
                                            onClick={() => handleDeleteWorkoutFromChallenge(item.id)}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.75rem', height: '1.75rem' }}>
                                                <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                                                <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>

                                        {/* Синий карандаш редактирования самого SPECIAL воркаута */}
                                        {/* Синий карандаш редактирования самого SPECIAL воркаута */}
                                        <button
                                            type="button"
                                            className="btn p-0 border-0 bg-transparent"
                                            onClick={() => {
                                                // Собираем слепок челленджа, чтобы конструктор воркаутов ПОМНИЛ его при редактировании
                                                const currentChallengeSnapshot = {
                                                    id: challengeId,
                                                    title: challenge.title,
                                                    description: challenge.description,
                                                    imageUrl: challenge.imageUrl,
                                                    workoutIds: challenge.workouts?.map(w => w.id) || []
                                                };

                                                // Переходим в режим редактирования конкретного воркаута, передавая контекст челленджа
                                                navigate(`/workouts/${item.id}/edit`, {
                                                    state: {
                                                        workout: item,
                                                        forcedType: 'SPECIAL',
                                                        parentChallenge: currentChallengeSnapshot // Важно!
                                                    }
                                                });
                                            }}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.75rem', height: '1.75rem' }}>
                                                <rect x="2" y="2" width="20" height="20" rx="4" fill="#2563eb" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1.5" />
                                                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>

                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* НИЖНЯЯ БОЛЬШАЯ СИНЯЯ КНОПКА ЗАПУСКА ПЕРВОЙ ТРЕНИРОВКИ ЧЕЛЛЕНДЖА */}
                {challenge.workouts && challenge.workouts.length > 0 && (
                    <button
                        type="button"
                        className="btn btn-primary w-100 py-3 rounded-3 fw-bold fs-5 border-0 text-white shadow"
                        style={{ backgroundColor: '#2563eb', marginTop: '1rem', marginBottom: '4rem' }}
                        onClick={() => {
                            console.log('Запуск челленджа! Передаем объект:', challenge);
                            // ИСПРАВЛЕНО НА 100%: Переходим по роуту челленджа и прокидываем весь объект целиком
                            navigate(`/challenges/${challengeId}/active`, { state: { challenge } });
                        }}
                    >
                        Start Challenge
                    </button>
                )}

            </div>
            <Footer />
        </div>
    );
};
