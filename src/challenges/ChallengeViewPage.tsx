/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './scss/WorkoutViewPage.module.scss'; // Переиспользуем готовые стили просмотра
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { workoutService, type ChallengeItem } from '../api/workoutService';

export const ChallengeViewPage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as { challenge?: ChallengeItem };

  const [challenge, setChallenge] = useState<ChallengeItem | null>(routerState?.challenge || null);
  const [loading, setLoading] = useState<boolean>(!challenge);

  // Если обновили страницу (F5), подтягиваем данные этого челленджа с бэка заново
  useEffect(() => {
    if (challengeId && !routerState?.challenge) {
      setLoading(true);
      // Предполагается метод getChallengeById, если его нет — можно перезапросить все и отфильтровать
      workoutService.getAllChallenges()
        .then((list) => {
          const found = list.find(c => c.id === challengeId);
          if (found) setChallenge(found);
        })
        .catch((err) => console.error('Ошибка при получении челленджа:', err))
        .finally(() => setLoading(false));
    }
  }, [challengeId, routerState]);

  if (loading) return <div className="text-center text-white mt-5 p-5">Загрузка информации...</div>;
  if (!challenge) return <div className="text-center text-white mt-5 p-5">Челлендж не найден.</div>;

  return (
    <div className="text-white min-vh-100 d-flex flex-column" style={{ backgroundColor: '#1a1a1a', fontFamily: 'sans-serif' }}>
      <div className="container flex-grow-1 py-4 px-3" style={{ maxWidth: '650px' }}>
        <Header />

        {/* Хедер: Название челленджа + Кнопка РЕДАКТИРОВАНИЯ (Карандаш) */}
        <div className="d-flex align-items-center justify-content-between my-4 w-100 px-1">
          <div>
            <h2 className="fs-3 fw-bold m-0">{challenge.title}</h2>
            <p className="text-muted small m-0 mt-1">{challenge.description}</p>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            {/* Вот та самая кнопка редактирования челленджа, которая открывает конструктор */}
            <button 
              className="btn btn-primary p-2 d-flex align-items-center justify-content-center rounded-3" 
              onClick={() => navigate(`/challenges/${challengeId}/edit`, { state: { challenge } })} 
              style={{ width: '2.5rem', height: '2.25rem', backgroundColor: '#2563eb', border: 'none' }}
              title="Редактировать челлендж"
            >
              <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.25rem' }}>
                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <h4 className="fs-6 text-muted fw-bold mb-3 px-1 text-uppercase tracking-wider">Тренировки испытания</h4>

        {/* Список SPECIAL тренировок внутри этого челленджа */}
        <div className="d-flex flex-column gap-3 mb-5 w-100">
          {(!challenge.workouts || challenge.workouts.length === 0) && (
            <div className="text-center text-secondary py-4 bg-dark rounded-4" style={{ backgroundColor: '#2d2d2d' }}>
              К этому челленджу пока не привязано ни одной тренировки.
            </div>
          )}

          {challenge.workouts?.map((item) => (
            <div 
              key={item.id} 
              className="card border-0 rounded-4 overflow-hidden shadow-sm text-white cursor-pointer" 
              style={{ backgroundColor: '#2d2d2d', height: '4.75rem', cursor: 'pointer' }}
              onClick={() => navigate(`/workouts/${item.id}`, { state: { workout: item } })}
            >
              <div className="row g-0 align-items-center h-100 w-100 px-3">
                
                <div className="col-auto h-100 d-flex align-items-center">
                  <div className="rounded-3 overflow-hidden bg-black d-flex align-items-center justify-content-center" style={{ width: '3.75rem', height: '3rem' }}>
                    <img src="/placeholder.png" alt={item.title} className="w-100 h-100 object-fit-cover" />
                  </div>
                </div>

                <div className="col ps-3 d-flex flex-column justify-content-center text-start">
                  <h3 className="fs-5 fw-bold mb-0 text-truncate" style={{ maxWidth: '280px' }}>{item.title}</h3>
                  <span className="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle rounded-pill small mt-1" style={{ width: 'fit-content', fontSize: '10px' }}>
                    {item.level}
                  </span>
                </div>

                <div className="col-auto pe-1 text-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '1.25rem' }}>
                    <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
};
