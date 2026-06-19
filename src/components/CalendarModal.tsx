/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import styles from './scss/CalendarModal.module.scss';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const currentYear = new Date().getFullYear();
  
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  if (!isOpen) return null;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Вычисляем, с какого дня недели начинается текущий месяц (чтобы сдвинуть числа на свои места)
  const getFirstDayOfWeek = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Корректируем, чтобы неделя начиналась с Понедельника (0 - Пн, 6 - Вс)
  };

  const totalDays = getDaysInMonth(selectedMonth, selectedYear);
  const startOffset = getFirstDayOfWeek(selectedMonth, selectedYear);

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  // Заглушки для пустых ячеек в начале месяца
  const emptyCells = Array.from({ length: startOffset }, (_, i) => i);

  const isDayCompleted = (day: number) => {
    return day % 3 === 0 || day === 8 || day === 11;
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  return (
    <div className={styles['calendar-overlay']} onClick={onClose}>
      <div className={styles['calendar-container']} onClick={(e) => e.stopPropagation()}>
        
        {/* Шапка управления */}
        <div className="row g-0 align-items-center justify-content-between mb-4">
          <div className="col-auto d-flex align-items-center gap-2">
            <button className={styles['nav-arrow-btn']} onClick={handlePrevMonth}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className={styles['current-month-display']}>
              {months[selectedMonth]} {selectedYear}
            </span>
            <button className={styles['nav-arrow-btn']} onClick={handleNextMonth}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="col-auto d-flex gap-2">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className={styles['calendar-select']}>
              {months.map((name, idx) => <option key={idx} value={idx}>{name}</option>)}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className={styles['calendar-select']}>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>

        {/* СТРОКА ДНЕЙ НЕДЕЛИ (Mon, Tue... Sun) */}
        <div className="row g-0 text-center mb-2 font-weight-bold">
          {weekDays.map((day) => (
            <div key={day} className="col" style={{ width: '14.28%', flex: '0 0 14.28%' }}>
              <span className={styles['calendar-weekday-label']}>{day}</span>
            </div>
          ))}
        </div>

        {/* ГОРИЗОНТАЛЬНАЯ СЕТКА ЧИСЕЛ МЕСЯЦА */}
        {/* Принудительно включаем flex-wrap строки, чтобы элементы переносились ровно по 7 штук */}
        <div className="row g-0 text-center d-flex flex-row flex-wrap justify-content-start align-items-center">
          
          {/* Рендерим пустые ячейки для сдвига дат на правильный день недели */}
          {emptyCells.map((val) => (
            <div key={`empty-${val}`} className="d-flex justify-content-center align-items-center mb-3" style={{ width: '14.28%', flex: '0 0 14.28%' }}>
              <div className={styles['calendar-day-circle-empty']}></div>
            </div>
          ))}

          {/* Рендерим реальные числа месяца */}
          {daysArray.map((day) => {
            const completed = isDayCompleted(day);
            return (
              <div 
                key={day} 
                className="d-flex justify-content-center align-items-center mb-3" 
                /* 100% / 7 дней = 14.28% ширины на каждую ячейку дня */
                style={{ width: '14.28%', flex: '0 0 14.28%' }}
              >
                <div className={`${styles['calendar-day-circle']} ${completed ? styles['calendar-day-circle--completed'] : ''}`}>
                  {completed ? (
                    <svg viewBox="0 0 24 24" fill="none" className={styles['checkmark-svg']}>
                      <circle cx="12" cy="12" r="11" fill="white" />
                      <circle cx="12" cy="12" r="9.5" fill="#3b82f6" />
                      <path d="M8.5 12.5l2.5 2.5 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span>{day}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="row g-0 justify-content-end mt-2">
          <button className={styles['close-btn']} onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
};
