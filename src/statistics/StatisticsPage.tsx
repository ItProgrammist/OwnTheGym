/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './scss/StatisticsPage.module.scss';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { workoutService, type StatEntryItem, type StatisticsResponse } from '../api/workoutService';

type FilterType = 'ALL' | 'WORKOUT' | 'CHALLENGE' | null;

export const StatisticsPage: React.FC = () => {
  const [statsData, setStatsData] = useState<StatisticsResponse | null>(null);
  
  // ИСПРАВЛЕНО: Изначально фильтр равен null, чтобы на экране ничего не выводилось до выбора
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError(null);
        const data = await workoutService.getStatistics();
        setStatsData(data);
      } catch (err: unknown) {
        console.error('Ошибка при загрузке статистики:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Не удалось загрузить данные статистики.');
        } else {
          setError('Произошла ошибка при связи с сервером.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className="text-center text-white mt-5">Загрузка логов истории...</div>;
  if (error) return <div className="alert alert-danger mx-auto mt-5 text-center" style={{ maxWidth: '500px' }}>{error}</div>;

  const workoutCount = statsData?.workoutDaysCount ?? 0;
  const challengeCount = statsData?.challengeDaysCount ?? 0;
  const allEntries = statsData?.entries || [];

  // ИСПРАВЛЕНО: Если фильтр равен null, массив отфильтрованных записей гарантированно пуст
  const filteredEntries = allEntries.filter((entry) => {
    if (activeFilter === null) return false;
    if (activeFilter === 'ALL') return true;
    return entry.type === activeFilter;
  });

  const formatDateString = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className={`${styles['statistics-page']} text-white min-vh-100 d-flex flex-column`} style={{ backgroundColor: '#1a1a1a', fontFamily: 'sans-serif' }}>
      <div className="container flex-grow-1 py-4 px-3 d-flex flex-column align-items-center" style={{ maxWidth: '640px' }}>
        <Header />

        {/* ПАНЕЛЬ ЗАГОЛОВКА И КНОПКА ALL RECORDS */}
        <div className="d-flex align-items-center justify-content-between mb-4 mt-2 w-100 px-1">
          <h2 className="fs-3 fw-bold m-0 text-white">Statistics</h2>
          <button 
            type="button" 
            className="btn btn-link p-0 border-0 text-decoration-none fw-bold"
            style={{ color: activeFilter === 'ALL' ? '#3b82f6' : '#9ca3af', fontSize: '0.95rem' }}
            onClick={() => setActiveFilter('ALL')}
          >
            All Records
          </button>
        </div>

        {/* ПАНЕЛЬ С КЛИКАБЕЛЬНЫМИ СЧЕТЧИКАМИ */}
        <div className="row g-0 w-100 text-center mb-4 px-1 py-2 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div 
            className="col-6 text-center" 
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveFilter('WORKOUT')}
          >
            <div className="small fw-bold text-uppercase tracking-wider mb-1" style={{ color: activeFilter === 'WORKOUT' ? '#3b82f6' : '#9ca3af' }}>
              Workouts
            </div>
            <div className="fs-3 fw-bold" style={{ color: activeFilter === 'WORKOUT' ? '#3b82f6' : '#ffffff' }}>
              {workoutCount}
            </div>
          </div>

          <div 
            className="col-6 text-center" 
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveFilter('CHALLENGE')}
          >
            <div className="small fw-bold text-uppercase tracking-wider mb-1" style={{ color: activeFilter === 'CHALLENGE' ? '#3b82f6' : '#9ca3af' }}>
              Challenges
            </div>
            <div className="fs-3 fw-bold" style={{ color: activeFilter === 'CHALLENGE' ? '#3b82f6' : '#ffffff' }}>
              {challengeCount}
            </div>
          </div>
        </div>

        {/* СПИСОК ВЫПОЛНЕННЫХ ПЛАШЕК ИСТОРИИ */}
        <div className="d-flex flex-column gap-3 w-100 mb-5">
          
          {/* ИСПРАВЛЕНО: Стартовая заглушка, когда изначально ничего не выбрано */}
          {activeFilter === null && (
            <div className="text-center py-5 small" style={{ color: "grey" }}>
              Пожалуйста, выберите категорию (Workouts, Challenges или All Records) для отображения истории занятий.
            </div>
          )}

          {/* Заглушка, если категория выбрана, но записей в ней нет */}
          {activeFilter !== null && filteredEntries.length === 0 && (
            <div className="text-center text-secondary py-5">
              В данной категории пока нет выполненных записей на сервере.
            </div>
          )}

          {/* Отрисовка списка карточек */}
          {activeFilter !== null && filteredEntries.map((item) => {
            if (!item) return null;

            const isWorkout = item.type === 'WORKOUT';
            const displayTitle = isWorkout ? item.workout?.title : item.challenge?.title;
            const displayLevel = isWorkout ? item.workout?.level || 'MEDIUM' : 'CHALLENGE';

            let levelColor = '#eab308'; 
            if (displayLevel === 'HARD' || displayLevel === 'INSANE') levelColor = '#ef4444'; 

            return (
              <div 
                key={item.id} 
                className="card border-0 rounded-4 overflow-hidden text-white shadow-sm w-100"
                style={{ backgroundColor: '#2d2d2d', height: '5.5rem' }}
              >
                <div className="row g-0 align-items-center h-100 w-100 px-3">
                  
                  <div className="col-auto h-100 d-flex align-items-center">
                    <div className="rounded-3 overflow-hidden bg-black d-flex align-items-center justify-content-center" style={{ width: '4.5rem', height: '3.75rem' }}>
                      <img src="/placeholder.png" alt="Finished" className="w-100 h-100 object-fit-cover" />
                    </div>
                  </div>

                  <div className="col ps-3 d-flex flex-column justify-content-center text-start">
                    <h3 className="fs-5 fw-bold mb-1 text-white text-truncate" style={{ maxWidth: '280px' }}>
                      {displayTitle || 'Выполненное занятие'}
                    </h3>
                    
                    <span className="small text-muted" style={{ fontSize: '12px' }}>
                      Difficulty: <strong style={{ color: levelColor }}>{displayLevel}</strong>
                    </span>
                  </div>

                  <div className="col-auto pe-1 text-end d-flex align-items-center h-100">
                    <span className="text-secondary" style={{ fontSize: '11px', color: '#888888' }}>
                      {formatDateString(item.day)}
                    </span>
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
