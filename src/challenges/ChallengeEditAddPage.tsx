/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './scss/ChallengeEditAddPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { workoutService, type ChallengeItem, type WorkoutItem } from '../api/workoutService';

export const ChallengeEditAddPage: React.FC = () => {
    const { challengeId } = useParams<{ challengeId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const routerState = location.state as { challenge?: ChallengeItem };

    const [title, setTitle] = useState<string>(routerState?.challenge?.title || '');
    const [description, setDescription] = useState<string>(routerState?.challenge?.description || '');
    const [imageUrl, setImageUrl] = useState<string>(routerState?.challenge?.imageUrl || '');

    const [availableSpecialWorkouts, setAvailableSpecialWorkouts] = useState<WorkoutItem[]>([]);
    const [selectedWorkoutIds, setSelectedWorkoutIds] = useState<string[]>(
        routerState?.challenge?.workouts?.map((w) => w.id) || []
    );

    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const returnedChallengeData = (location.state as any)?.challenge;
        const newWorkoutId = (location.state as any)?.justCreatedWorkoutId;

        if (returnedChallengeData && newWorkoutId) {
            console.log('Челлендж успешно перехвачен из роутера!');
            console.log('Обновленный список ID тренировок:', returnedChallengeData.workoutIds);

            // Намертво фиксируем массив со всеми старыми и новой тренировкой в стейт чекбоксов
            setSelectedWorkoutIds(returnedChallengeData.workoutIds || []);

            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Подгружаем SPECIAL-воркауты при старте страницы
    useEffect(() => {
        async function fetchSpecialData() {
            try {
                setLoading(true);
                const data = await workoutService.getSpecialWorkouts();
                setAvailableSpecialWorkouts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Ошибка при получении SPECIAL тренировок:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchSpecialData();
    }, []);

    const handleToggleWorkout = (id: string) => {
        setSelectedWorkoutIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleCreateNewSpecialWorkout = () => {
        const currentChallengeSnapshot = {
            id: challengeId,
            title: title.trim(),
            description: description.trim(),
            imageUrl: imageUrl.trim(),
            workoutIds: selectedWorkoutIds
        };

        navigate('/workouts/new/edit', {
            state: {
                forcedType: 'SPECIAL',
                parentChallenge: currentChallengeSnapshot
            }
        });
    };



    // отправляем на бэк
    const handleSaveChallenge = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            alert('Пожалуйста, заполните название и описание челленджа.');
            return;
        }

        const formattedWorkouts = selectedWorkoutIds.map((id) => ({ id }));

        const payload = {
            title: title.trim(),
            description: description.trim(),
            imageUrl: imageUrl.trim() || 'string',
            workouts: formattedWorkouts,
            workoutIds: selectedWorkoutIds
        };

        console.log('=== [ЧЕЛЛЕНДЖ] ОТПРАВКА PAYLOAD НА БЭКЕНД ===');
        console.log(JSON.stringify(payload, null, 2));
        console.log('============================================');

        try {
            setSubmitting(true);

            if (challengeId === 'new' || !challengeId) {
                console.log('Вызов: POST /challenges');
                await workoutService.createChallenge(payload);
            } else {
                console.log(`Вызов: PUT /challenges/${challengeId}`);
                await workoutService.updateChallenge(challengeId, payload);
            }

            console.log('Челлендж успешно сохранен на сервере!');
            navigate('/challenges');
        } catch (err: unknown) {
            console.error('=== КРИТИЧЕСКАЯ ОШИБКА СОХРАНЕНИЯ ЧЕЛЛЕНДЖА ===', err);

            if (axios.isAxiosError(err)) {
                console.log('Ответ сервера с ошибкой:', err.response?.data);
                const serverError = err.response?.data?.message || err.response?.data?.error;
                alert(`Не удалось сохранить челлендж. Ошибка сервера: ${serverError || 'Нельзя создать челлендж без тренировок'}`);
            } else {
                alert('Произошла непредвиденная ошибка сети.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`${styles['challenge-edit-page']} text-white min-vh-100 d-flex flex-column`} style={{ backgroundColor: '#1a1a1a', fontFamily: 'sans-serif' }}>
            <div className="container flex-grow-1 py-4 px-3 d-flex flex-column align-items-center" style={{ maxWidth: '640px' }}>
                <Header />

                <h2 className="fs-3 fw-bold my-4 text-start w-100 px-1">
                    {challengeId === 'new' || !challengeId ? 'Create New Challenge' : 'Edit Challenge'}
                </h2>

                <form onSubmit={handleSaveChallenge} className="w-100 d-flex flex-column gap-3 mb-5">
                    <div className="text-start">
                        <label className="form-label small fw-bold">CHALLENGE TITLE</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Challenge name..." className="form-control border-0 p-3 text-white" style={{ backgroundColor: '#2d2d2d', borderRadius: '0.75rem' }} required />
                    </div>

                    <div className="text-start">
                        <label className="form-label small fw-bold">DESCRIPTION</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this challenge about?..." className="form-control border-0 p-3 text-white" rows={3} style={{ backgroundColor: '#2d2d2d', borderRadius: '0.75rem', resize: 'none' }} required />
                    </div>

                    <div className="text-start">
                        <label className="form-label small fw-bold">IMAGE URL</label>
                        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste link to image..." className="form-control border-0 p-3 text-white" style={{ backgroundColor: '#2d2d2d', borderRadius: '0.75rem', color: "grey" }} />
                    </div>

                    <div className="text-start mt-3 w-100">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <label className="form-label small  fw-bold m-0">ATTACH SPECIAL WORKOUTS</label>
                            <button type="button" className="btn btn-sm btn-outline-primary px-3 rounded-pill" onClick={handleCreateNewSpecialWorkout} style={{ fontSize: '12px', fontWeight: 600 }}>
                                + New Special Workout
                            </button>
                        </div>

                        {loading && <div className="text-muted small py-2">Загрузка доступных SPECIAL тренировок...</div>}

                        {!loading && availableSpecialWorkouts.length === 0 && (
                            <div className=" small py-4 text-center border border-secondary border-dashed rounded-3" style={{ borderStyle: 'dashed', color: 'grey' }}>
                                В базе данных бэка пока нет тренировок с типом SPECIAL.
                            </div>
                        )}

                        <div className="d-flex flex-column gap-2 w-100 overflow-y-auto" style={{ maxHeight: '300px' }}>
                            {availableSpecialWorkouts.map((wk) => (
                                <div
                                    key={wk.id}
                                    className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                                    style={{ backgroundColor: '#252525', cursor: 'pointer' }}
                                    onClick={() => handleToggleWorkout(wk.id)}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <input type="checkbox" checked={selectedWorkoutIds.includes(wk.id)} onChange={() => handleToggleWorkout(wk.id)} onClick={(e) => e.stopPropagation()} style={{ width: '1.15rem', height: '1.15rem', accentColor: '#2563eb' }} />
                                        <span className="fw-semibold text-white">{wk.title}</span>
                                    </div>
                                    <span className="badge bg-dark text-secondary border border-secondary rounded-pill small px-2 py-1" style={{ fontSize: '10px' }}>
                                        {wk.level}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-3 mt-4 rounded-3 fw-bold fs-5 border-0 text-white" disabled={submitting} style={{ backgroundColor: '#2563eb' }}>
                        {submitting ? 'Saving Challenge...' : 'Save Challenge'}
                    </button>
                </form>

            </div>
            <Footer />
        </div>
    );
};
