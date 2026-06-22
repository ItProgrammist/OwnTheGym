/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './scss/MainPage.module.scss';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { workoutService } from './api/workoutService';

interface LocalCalendarEntry {
  day: string; 
  type: 'WORKOUT' | 'CHALLENGE';
}

interface CalendarWeekResponse {
  period: string;
  year: number | null;
  month: number | null;
  startDate: string;
  endDate: string;
  entries: LocalCalendarEntry[];
}

interface DayColumn {
  label: string;      
  dateStr: string;    
  dayNumber: number;  
}

export const MainPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Раздельные массивы для двух эндпоинтов сервера
  const [weekEntries, setWeekEntries] = useState<LocalCalendarEntry[]>([]);
  const [monthEntries, setMonthEntries] = useState<LocalCalendarEntry[]>([]);
  
  const [weekDays, setWeekDays] = useState<DayColumn[]>([]);
  const [isFullCalendarOpen, setIsFullCalendarOpen] = useState<boolean>(false);
  
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()); 
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const yearsList = useMemo(() => {
    const list = [];
    for (let y = 2020; y <= 2030; y++) list.push(y);
    return list;
  }, []);

  // 1. Расчет дней текущей недели СТРОГО С ПОНЕДЕЛЬНИКА
  useEffect(() => {
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const current = new Date();
    
    let dayOfWeek = current.getDay(); 
    let distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(current);
    monday.setDate(current.getDate() + distanceToMonday);

    const days: DayColumn[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);

      const year = nextDay.getUTCFullYear();
      const month = String(nextDay.getUTCMonth() + 1).padStart(2, '0');
      const date = String(nextDay.getUTCDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${date}`;

      days.push({
        label: labels[i],
        dateStr: dateStr,
        dayNumber: nextDay.getUTCDate()
      });
    }
    setWeekDays(days);
  }, []);

  // 2. ЗАПРОС 1: Недельная лента ?date=YYYY-MM-DD
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    const currentDateStr = `${year}-${month}-${date}`;

    workoutService.getCalendarWeek(currentDateStr)
      .then((res) => {
        setWeekEntries(res?.entries || []);
      })
      .catch((err) => console.error('Ошибка загрузки недели:', err));
  }, []);

  // 3. ЗАПРОС 2: Сетка большого месяца ?year=YYYY&month=MM
  useEffect(() => {
    const apiMonth = currentMonth + 1;
    workoutService.getCalendarMonth(currentYear, apiMonth)
      .then((res) => {
        setMonthEntries(res?.entries || []);
      })
      .catch((err) => console.error('Ошибка загрузки месяца:', err));
  }, [currentMonth, currentYear]);

  // 4. Матрица дней для сетки месяца
  const gridDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    let startDayOfWeek = firstDay.getDay() - 1; 
    if (startDayOfWeek === -1) startDayOfWeek = 6; 

    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysArray = [];

    for (let i = 0; i < startDayOfWeek; i++) daysArray.push(null);

    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dateStr = String(d).padStart(2, '0');
      daysArray.push({
        dayNumber: d,
        dateStr: `${currentYear}-${monthStr}-${dateStr}`
      });
    }
    return daysArray;
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

    return (
    <div className={styles['main-page']} style={{ backgroundColor: '#1a1a1a', fontFamily: 'sans-serif', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div className="container flex-grow-1 py-4 px-3 d-flex flex-column align-items-center" style={{ maxWidth: '640px' }}>
        <Header />

        {/* МАЛЕНЬКИЙ НЕДЕЛЬНЫЙ КАЛЕНДАРЬ НА ГЛАВНОЙ */}
        <div className="w-100 mb-4 mt-3 px-1">
          <div className="d-flex align-items-center justify-content-between mb-3 w-100">
            <h2 className="fs-4 fw-bold m-0 text-white" style={{ letterSpacing: '0.01em' }}>History</h2>
            <button 
              type="button" 
              className="btn btn-link p-0 border-0 text-decoration-none fw-bold"
              style={{ color: '#3b82f6', fontSize: '0.9rem' }}
              onClick={() => setIsFullCalendarOpen(true)}
            >
              All Records
            </button>
          </div>

          {/* Недельная плашка (Старт строго с Понедельника) */}
          <div className="row g-0 w-100 py-3 rounded-4 px-2 shadow-sm" style={{ backgroundColor: '#2d2d2d' }}>
            {weekDays.map((day) => {
              const dayRecords = weekEntries.filter((e) => e.day && e.day.startsWith(day.dateStr));
              const hasChallenge = dayRecords.some((e) => e.type === 'CHALLENGE');
              const hasWorkout = dayRecords.some((e) => e.type === 'WORKOUT');

              return (
                <div key={day.dateStr} className="col d-flex flex-column align-items-center justify-content-center">
                  <span className="text-secondary small fw-bold mb-2" style={{ fontSize: '11px', color: '#888888' }}>
                    {day.label}
                  </span>
                  <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '2rem' }}>
                    {hasChallenge ? (
                      <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.45rem', height: '1.45rem' }}><circle cx="12" cy="12" r="11" fill="#eab308" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : hasWorkout ? (
                      <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.45rem', height: '1.45rem' }}><circle cx="12" cy="12" r="11" fill="#2563eb" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : (
                      <span className="fw-bold text-white" style={{ fontSize: '14px' }}>{day.dayNumber}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* БОЛЬШОЙ ПОЛНОРАЗМЕРНЫЙ МОДАЛЬНЫЙ КАЛЕНДАРЬ НА МЕСЯЦ ИЗ МАКЕТА */}
        {isFullCalendarOpen && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 99999, backdropFilter: 'blur(3px)' }}>
            <div className="w-100 p-4 rounded-4 shadow-lg text-white" style={{ backgroundColor: '#2d2d2d', maxWidth: '440px' }}>
              
              {/* Навигация месяца (Стрелочки + Выпадающие списки выбора) */}
              <div className="d-flex align-items-center mb-4 gap-2 w-100">
                <button type="button" className="btn btn-transparent p-1 text-primary border-0 fw-bold fs-4" onClick={handlePrevMonth} style={{ color: '#3b82f6' }}>‹</button>
                <span className="fs-5 fw-bold text-white me-auto px-1">{monthsList[currentMonth]} {currentYear}</span>
                <button type="button" className="btn btn-transparent p-1 text-primary border-0 fw-bold fs-4 me-2" onClick={handleNextMonth} style={{ color: '#3b82f6' }}>›</button>

                <select value={currentMonth} onChange={(e) => setCurrentMonth(Number(e.target.value))} className="form-select form-select-sm border-0 text-white fw-semibold px-2" style={{ backgroundColor: '#1a1a1a', width: '5.2rem', borderRadius: '0.5rem' }}>
                  {monthsList.map((m, idx) => <option key={m} value={idx} style={{ background: '#2d2d2d' }}>{m.substring(0, 3)}</option>)}
                </select>

                <select value={currentYear} onChange={(e) => setCurrentYear(Number(e.target.value))} className="form-select form-select-sm border-0 text-white fw-semibold px-2" style={{ backgroundColor: '#1a1a1a', width: '4.8rem', borderRadius: '0.5rem' }}>
                  {yearsList.map((y) => <option key={y} value={y} style={{ background: '#2d2d2d' }}>{y}</option>)}
                </select>
              </div>

              {/* Сетка заголовков дней недели строго MON-SUN */}
              <div className="row g-0 text-center mb-2 fw-bold small" style={{ fontSize: '10px', color: 'grey' }}>
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => <div key={d} className="col">{d}</div>)}
              </div>

              {/* Дни месяца с синими и золотыми галочками выполнения */}
              <div className="row g-0 text-center row-gap-3 mb-4">
                {gridDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="col" style={{ minWidth: '14.28%' }}></div>;

                  const dayRecords = monthEntries.filter((e) => e.day && e.day.startsWith(day.dateStr));
                  const hasChallenge = dayRecords.some((e) => e.type === 'CHALLENGE');
                  const hasWorkout = dayRecords.some((e) => e.type === 'WORKOUT');

                  return (
                    <div key={day.dateStr} className="col d-flex align-items-center justify-content-center" style={{ minWidth: '14.28%', minHeight: '2.2rem' }}>
                      {hasChallenge ? (
                        <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.6rem', height: '1.6rem' }}><circle cx="12" cy="12" r="11" fill="#eab308" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : hasWorkout ? (
                        <svg viewBox="0 0 24 24" fill="none" style={{ width: '1.6rem', height: '1.6rem' }}><circle cx="12" cy="12" r="11" fill="#2563eb" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center text-white fw-bold rounded-circle" style={{ width: '1.85rem', height: '1.85rem', backgroundColor: '#1a1a1a', fontSize: '13px' }}>
                          {day.dayNumber}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Кнопка Close со скриншота */}
              <button type="button" className="btn btn-primary w-100 py-2 rounded-3 fw-bold border-0 text-white" style={{ backgroundColor: '#3b82f6', borderRadius: '0.75rem' }} onClick={() => setIsFullCalendarOpen(false)}>
                Close
              </button>

            </div>
          </div>
        )}

        {/* Нижний дефолтный блок */}
        <div className="w-100 d-flex flex-column gap-3 text-start px-1 mt-2">
          <p className="text-center small m-0"  style={{color: 'grey' }}>Выберите раздел в меню навигации, чтобы начать тренировочную сессию.</p>
        </div>

      </div>
      <Footer />
    </div>
  );
};
