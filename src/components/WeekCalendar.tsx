/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './scss/WeekCalendar.module.scss';
import { workoutService, type CalendarEntryItem } from '../api/workoutService';

interface DayColumn {
  label: string;      
  dateStr: string;    
  dayNumber: number;  
}

export const WeekCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<CalendarEntryItem[]>([]);
  const [weekDays, setWeekDays] = useState<DayColumn[]>([]);

  // 1. Генерируем дни актуальной текущей недели (от S до S)
  useEffect(() => {
    const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const current = new Date();
    
    // Находим воскресенье текущей недели (в американском стиле вашего макета)
    const sunday = new Date(current);
    sunday.setDate(current.getDate() - current.getDay());

    const days: DayColumn[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(sunday);
      nextDay.setDate(sunday.getDate() + i);

      const year = nextDay.getFullYear();
      const month = String(nextDay.getMonth() + 1).padStart(2, '0');
      const date = String(nextDay.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${date}`;

      days.push({
        label: labels[i],
        dateStr: dateStr,
        dayNumber: nextDay.getDate()
      });
    }
    setWeekDays(days);
  }, []);

  // 2. Получаем логи выполненных занятий с бэкенда (порт 5050)
  useEffect(() => {
    workoutService.getCalendarWeek()
      .then((res) => {
        setEntries(res?.entries || []);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке недельного календаря:', err);
      });
  }, []);

  return (
    <div className="w-100 mb-4 px-1" style={{ maxWidth: '640px', margin: '0 auto' }}>
      
      {/* Панель заголовка */}
      <div className="d-flex align-items-center justify-content-between mb-3 w-100">
        <h2 className="fs-4 fw-bold m-0 text-white" style={{ letterSpacing: '0.01em' }}>History</h2>
        <button 
          type="button" 
          className="btn btn-link p-0 border-0 text-decoration-none fw-bold"
          style={{ color: '#3b82f6', fontSize: '0.9rem' }}
          onClick={() => navigate('/statistics')}
        >
          All Records
        </button>
      </div>

      {/* Основная плашка календаря из макета */}
      <div className="row g-0 w-100 py-3 rounded-4 px-2" style={{ backgroundColor: '#2d2d2d' }}>
        {weekDays.map((day) => {
          // Ищем все записи, сделанные в этот конкретный день недели
          const dayRecords = entries.filter((e) => e.day === day.dateStr);
          
          // Проверяем наличие выполненных активностей
          const hasChallenge = dayRecords.some((e) => e.type === 'CHALLENGE');
          const hasWorkout = dayRecords.some((e) => e.type === 'WORKOUT');

          return (
            <div key={day.dateStr} className="col d-flex flex-column align-items-center justify-content-center">
              {/* Буква дня (S, M, T...) */}
              <span className="text-secondary small fw-bold mb-2" style={{ fontSize: '11px', color: '#888888' }}>
                {day.label}
              </span>

              {/* Ячейка статуса выполнения */}
              <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '2rem' }}>
                {hasChallenge ? (
                  /* ИСПРАВЛЕНО: Золотая круглая галочка при выполненном челлендже */
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.5rem', height: '1.5rem' }}>
                    <circle cx="12" cy="12" r="11" fill="#eab308" />
                    <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : hasWorkout ? (
                  /* Синяя круглая галочка при выполненной обычной тренировке */
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.5rem', height: '1.5rem' }}>
                    <circle cx="12" cy="12" r="11" fill="#2563eb" />
                    <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  /* Обычная цифра числа, если тренировок не было */
                  <span className="fw-bold text-white" style={{ fontSize: '14px' }}>
                    {day.dayNumber}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
