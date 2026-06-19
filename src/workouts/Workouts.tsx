/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './scss/Workouts.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface WorkoutItem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
    imageUrl: string;
}

export const Workouts: React.FC = () => {
    const navigate = useNavigate(); // Инициализируем хук навигации

    const workouts: WorkoutItem[] = [
        {
            id: 'chest-mission',
            title: 'Chest Mission',
            difficulty: 'Hard',
            imageUrl: '../../public/placeholder.png',
        },
        {
            id: 'arms-killer',
            title: 'Arms Killer',
            difficulty: 'Medium',
            imageUrl: '../../public/placeholder.png',
        },
        {
            id: 'leg-armageddon',
            title: 'Leg Armageddon',
            difficulty: 'Insane',
            imageUrl: '../../public/placeholder.png',
        },
    ];

    const getDifficultyClass = (diff: 'Easy' | 'Medium' | 'Hard' | 'Insane') => {
        if (diff === 'Medium') return styles['workout-row__difficulty--medium'];
        if (diff === 'Hard') return styles['workout-row__difficulty--hard'];
        return styles['workout-row__difficulty--insane'];
    };

    // КЛИК НА КНОПКУ ADD: перенаправляет на страницу конструктора в режиме создания нового воркаута
    const handleCreateWorkout = () => {
        // Передаем параметр 'new', при этом state оставляем пустым, чтобы инпуты открылись чистыми
        navigate('/workouts/new/edit');
    };

    // Блокируем всплытие клика карточки и обрабатываем удаление
    const handleDelete = (e: React.MouseEvent, title: string) => {
        e.stopPropagation(); // Не дает сработать переходу по большой карточке
        console.log(`Удаление тренировки: ${title}`);
    };

    // Блокируем всплытие клика карточки и перенаправляем на конструктор/редактирование
    const handleEdit = (e: React.MouseEvent, workout: WorkoutItem) => {
        e.stopPropagation(); // Не дает сработать переходу по большой карточке
        
        // Передаем объект воркаута для автоматического заполнения инпутов и дропдауна
        navigate(`/workouts/${workout.id}/edit`, { state: { workout: workout } });
    };

    return (
        <div className={styles['workouts-page']}>
            <div className={styles['workouts-page__content']}>

                {/* Логотип */}
                <Header />

                {/* Навигация секции с кнопкой Add */}
                <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
                    <div className="col-auto">
                        <h2 className={styles['workouts-page__title']}>Workouts</h2>
                    </div>
                    <div className="col-auto">
                        {/* ИСПРАВЛЕНО: Добавлен обработчик onClick для создания тренировки */}
                        <button 
                            className={styles['workouts-page__add-btn']}
                            onClick={handleCreateWorkout}
                        >
                            {/* Плюс в зеленом круге */}
                            <svg viewBox="0 0 24 24" fill="none" className="me-2">
                                <circle cx="12" cy="12" r="11" fill="#22c55e" />
                                <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                            Add
                        </button>
                    </div>
                </div>

                {/* Список тренировок в виде горизонтальных плашек */}
                <div className="d-flex flex-column gap-3">
                    {workouts.map((workout) => (
                        <div 
                            key={workout.id} 
                            className={styles['workout-row-link']}
                            onClick={() => navigate(`/workouts/${workout.id}`, { state: { workout: workout } })}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={styles['workout-row']}>
                                <div className="row g-0 align-items-center w-full h-100">

                                    {/* Картинка */}
                                    <div className="col-auto h-100">
                                        <div className={styles['workout-row__image-wrapper']}>
                                            <img src={workout.imageUrl} alt={workout.title} />
                                        </div>
                                    </div>

                                    {/* Инфо (Название + Сложность) */}
                                    <div className="col ps-3 d-flex flex-column justify-content-center">
                                        <h3 className={styles['workout-row__title']}>{workout.title}</h3>
                                        <p className={styles['workout-row__difficulty-label']}>
                                            Difficulty:{' '}
                                            <span className={getDifficultyClass(workout.difficulty)}>
                                                {workout.difficulty}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Кнопки управления (Удалить + Редактировать) */}
                                    <div className="col-auto pe-3 d-flex align-items-center gap-2">
                                        
                                        {/* Кнопка Удаления */}
                                        <button 
                                            className={styles['workout-row__action-btn']}
                                            onClick={(e) => handleDelete(e, workout.title)}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" fill="#fca5a5" />
                                                <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>

                                        {/* Кнопка Редактирования */}
                                        <button 
                                            className={styles['workout-row__action-btn']}
                                            onClick={(e) => handleEdit(e, workout)}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <rect x="2" y="2" width="20" height="20" rx="4" fill="#1d4ed8" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1.5" />
                                                <path d="M7 17l2.5.5L17 10l-3-3-7.5 7.5L7 17zM13 8l3 3" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Нижний таб-бар */}
            <Footer />
        </div>
    );
};
