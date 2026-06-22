/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './scss/ChallengesPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { workoutService, type ChallengeItem } from '../api/workoutService';

export const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadChallenges() {
    try {
      setLoading(true);
      setError(null);

      const data = await workoutService.getAllChallenges();

      console.log('=== [ЧЕЛЛЕНДЖИ С БЭКЕНДА] ДАННЫЕ УСПЕШНО ПРИЛЕТЕЛИ ===');
      console.log('Тип данных:', typeof data);
      console.log('Является ли массивом:', Array.isArray(data));
      console.log('Сам ответ (data):', data);
      console.log('======================================================');

      setChallenges(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('=== [КРИТИЧЕСКАЯ ОШИБКА СЕТИ ЧЕЛЛЕНДЖЕЙ] ===', err);
      if (axios.isAxiosError(err)) {
        console.log('Статус-код ошибки сервера:', err.response?.status);
        console.log('Тело ошибки сервера:', err.response?.data);
        setError(err.response?.data?.message || 'Не удалось загрузить челленджи с сервера.');
      } else {
        setError('Произошла ошибка при получении списка испытаний.');
      }
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadChallenges();
  }, []);

  function handleCreateChallenge() {
    navigate('/challenges/new/edit');
  }

  return (
    <div className={`${styles['challenges-page']} text-white min-vh-100 d-flex flex-column`} style={{ backgroundColor: '#1a1a1a', fontFamily: 'sans-serif' }}>
      <div className="container flex-grow-1 py-4 px-3 d-flex flex-column align-items-center" style={{ maxWidth: '640px' }}>
        <Header />

        {/* Панель навигации секции */}
        <div className="d-flex align-items-center justify-content-between mb-4 mt-2 w-100 px-1">
          <h2 className="fs-3 fw-bold m-0">Challenges</h2>
          <button
            className="btn btn-success d-flex align-items-center gap-2 fw-semibold px-3 py-2 border-0 shadow-sm"
            onClick={handleCreateChallenge}
            style={{ backgroundColor: '#22c55e', borderRadius: '0.75rem' }}
          >
            <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.25rem', height: '1.25rem' }}>
              <circle cx="12" cy="12" r="11" fill="none" stroke="white" strokeWidth="2.5" />
              <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Add
          </button>
        </div>

        {/* Индикаторы загрузки и сетевых ошибок */}
        {loading && <div className="text-center my-4 fs-5" style={{ color: 'grey' }}>Загрузка активных испытаний...</div>}
        {error && <div className="alert alert-danger w-100 py-2 rounded-3 small border-0 text-center">{error}</div>}

        {/* Состояние пустого списка */}
        {!loading && !error && challenges.length === 0 && (
          <div className="text-center text-secondary py-5">
            <p className="m-0">Глобальные челленджи пока отсутствуют на сервере.</p>
            <span className="small" style={{ color: 'grey' }}>Нажмите кнопку Add, чтобы создать первое испытание.</span>
          </div>
        )}

        {/* СЕТКА С КАРТОЧКАМИ ЧЕЛЛЕНДЖЕЙ */}
        <div className="d-flex flex-column gap-3 w-100 mb-5">
          {challenges.map((challenge) => {
            if (!challenge) return null;

            const workoutsCount = challenge.workouts?.length || 0;

            return (
              <div
                key={challenge.id}
                className="card border-0 rounded-4 overflow-hidden text-white shadow-sm w-100"
                style={{ backgroundColor: '#2d2d2d', cursor: 'pointer', transition: 'transform 0.1s' }}
                onClick={() => navigate(`/challenges/${challenge.id}`, { state: { challenge } })}
              >
                <div className="row g-0 align-items-center p-3">

                  {/* Картинка челленджа */}
                  <div className="col-auto">
                    <div className="rounded-3 overflow-hidden bg-black d-flex align-items-center justify-content-center" style={{ width: '4.5rem', height: '4.5rem' }}>
                      <img
                        src={challenge.imageUrl || '/placeholder.png'}
                        alt={challenge.title || 'Challenge'}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                      />
                    </div>
                  </div>

                  {/* Текстовое описание */}
                  <div className="col ps-3 text-start">
                    <h3 className="fs-5 fw-bold mb-1 text-white">{challenge.title || 'Без названия'}</h3>
                    <p className="small text-muted mb-2 text-truncate" style={{ maxWidth: '260px' }}>
                      {challenge.description || 'Описание фитнес-испытания отсутствует.'}
                    </p>

                    <span className="badge text-primary-emphasis bg-primary-subtle border border-primary-subtle px-2 py-1 small rounded" style={{ fontSize: '11px' }}>
                      {workoutsCount} {workoutsCount === 1 ? 'workout' : 'workouts'}
                    </span>
                  </div>

                  {/* ДВЕ ИКОНКИ УПРАВЛЕНИЯ В ПРАВОМ УГЛУ ПЛАШКИ */}
                  <div className="col-auto d-flex align-items-center gap-2 pe-1">

                    {/* КАРАНДАШ: Редактировать челлендж */}
                    <button
                      type="button"
                      className="btn p-2 d-flex align-items-center justify-content-center border-0"
                      style={{ width: '2.25rem', height: '2.25rem', backgroundColor: 'rgba(37, 99, 235, 0.2)', borderRadius: '0.5rem', color: '#3b82f6' }}
                      onClick={(e) => {
                        e.stopPropagation(); // Не даем открыться просмотру челленджа
                        navigate(`/challenges/${challenge.id}/edit`, { state: { challenge } });
                      }}
                      title="Редактировать челлендж"
                    >
                      <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.15rem', height: '1.15rem' }}>
                        <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {/* ИСПРАВЛЕНО: Кнопка удаления челленджа (Красная корзина) */}
                    <button
                      type="button"
                      className="btn p-2 d-flex align-items-center justify-content-center border-0"
                      style={{ width: '2.25rem', height: '2.25rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', borderRadius: '0.5rem', color: '#ef4444' }}
                      onClick={async (e) => {
                        e.stopPropagation();

                        if (window.confirm(`Вы уверены, что хотите навсегда удалить челлендж "${challenge.title}"?`)) {
                          try {
                            console.log(`[ФРОНТЕНД] Отправка DELETE /challenges/${challenge.id}`);
                            await workoutService.deleteChallenge(challenge.id);

                            setChallenges((prev) => prev.filter((c) => c.id !== challenge.id));
                            console.log('Челлендж успешно удален!');
                          } catch (err: unknown) {
                            // ТИТАНОВЫЙ ЛОГ: Выводим в консоль точный ответ сервера
                            console.error('%c=== ОШИБКА УДАЛЕНИЯ ЧЕЛЛЕНДЖА ===', 'color: #ef4444; font-weight: bold;', err);

                            if (axios.isAxiosError(err)) {
                              console.log('Статус ответа бэка:', err.response?.status); // Например, 400, 405 или 500
                              console.log('Детали ошибки от Spring Boot (Data):', err.response?.data);

                              const serverMessage = err.response?.data?.message || err.response?.data?.error;
                              alert(`Не удалось удалить: ${serverMessage || 'Ошибка формата запроса'}. Скорее всего челлендж уже записан в историю выполненных.`);
                            } else {
                              alert('Произошла непредвиденная ошибка сети.');
                            }
                          }
                        }
                      }}

                      title="Удалить челлендж"
                    >
                      <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.15rem', height: '1.15rem' }}>
                        <path d="M19 7l-.8 13.1c-.1 1.1-.9 1.9-2 1.9H7.8c-1.1 0-1.9-.8-2-1.9L5 7m5 4v6m4-6v6M1 7h22M8 7V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {/* Шеврон перехода на SingleChallengePage */}
                    <div className="text-secondary ms-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '1.25rem' }}>
                        <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                  </div>


                </div>
              </div>
            );
          })}
        </div>


      </div>
      <Footer />
    </div>
  );
};
