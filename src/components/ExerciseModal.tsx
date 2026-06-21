/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import styles from './scss/ExerciseModal.module.scss';
import { getVideoEmbedLink } from '../utils/videoEmbed';
import { workoutService, type ExerciseResponse } from '../api/workoutService';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: {
    reps: number;
    time: number;
    mode: 'reps' | 'time';
  }) => Promise<void>;
  exerciseId?: string;
  exerciseName: string;
  initialReps: number;
  initialTime?: number;
  description?: string;
  videoThumbnail?: string;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  exerciseId,
  exerciseName,
  initialReps,
  initialTime = 0,
  description = '',
  videoThumbnail = '',
}) => {
  const [mode, setMode] = useState<'reps' | 'time'>(initialTime > 0 ? 'time' : 'reps');
  const [inputValue, setInputValue] = useState<number>(initialTime > 0 ? initialTime : initialReps);
  const [submitting, setSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [exerciseDetails, setExerciseDetails] = useState<ExerciseResponse | null>(null);
  const [loadingExercise, setLoadingExercise] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setExerciseDetails(null);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(false);
    const currentMode = initialTime > 0 ? 'time' : 'reps';
    setMode(currentMode);
    setInputValue(currentMode === 'time' ? initialTime : initialReps);

    if (!exerciseId) {
      setExerciseDetails(null);
      return;
    }

    let cancelled = false;
    setLoadingExercise(true);

    workoutService.getExerciseById(exerciseId)
      .then((data) => {
        if (!cancelled) setExerciseDetails(data);
      })
      .catch(() => {
        if (!cancelled) setExerciseDetails(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingExercise(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, exerciseId, initialReps, initialTime]);

  if (!isOpen) return null;

  const resolvedDescription = exerciseDetails?.description || description;
  const resolvedVideoUrl = exerciseDetails?.videoUrl || videoThumbnail || '';
  const embedLink = getVideoEmbedLink(resolvedVideoUrl);
  const isLinkValid = embedLink.length > 0;

  const handleToggleMode = () => {
    const nextMode = mode === 'reps' ? 'time' : 'reps';
    setMode(nextMode);
    setInputValue(nextMode === 'time' ? (initialTime || 0) : (initialReps || 0));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const repsValue = mode === 'reps' ? inputValue : 0;
      const timeValue = mode === 'time' ? inputValue : 0;

      await onSave({
        reps: repsValue,
        time: timeValue,
        mode,
      });

      onClose();
    } catch {
      alert('Ошибка при сохранении изменений сета.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['modal-container__title-plate']}>
          <h3>{exerciseName || exerciseDetails?.title || 'Упражнение'}</h3>
        </div>

        <div className={styles['video-player']}>
          {loadingExercise ? (
            <div className="d-flex align-items-center justify-content-center h-100 text-white-50 small">
              Загрузка видео...
            </div>
          ) : isPlaying && isLinkValid ? (
            <iframe
              key={embedLink}
              src={embedLink}
              title="Exercise video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className={styles['video-player__iframe']}
              style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}
            ></iframe>
          ) : isPlaying && !isLinkValid ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 p-3 text-center bg-black">
              <p className="small text-white-50 mb-2">Неподдерживаемый формат ссылки.</p>
              {resolvedVideoUrl.trim() && (
                <a href={resolvedVideoUrl.trim()} target="_blank" rel="noopener noreferrer" className="text-info small">
                  Открыть в новой вкладке
                </a>
              )}
            </div>
          ) : (
            <React.Fragment>
              <img src="/placeholder.png" alt="Preview" className={styles['video-player__thumbnail']} />
              <button
                type="button"
                className={styles['video-player__play-btn']}
                onClick={(e) => { e.stopPropagation(); setIsPlaying(true); }}
                disabled={!resolvedVideoUrl.trim() || loadingExercise}
                style={{ opacity: resolvedVideoUrl.trim() && !loadingExercise ? 1 : 0.4 }}
              >
                <svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="#3b82f6" /></svg>
              </button>
            </React.Fragment>
          )}
        </div>

        <div className="row g-0 align-items-center justify-content-between mb-4 px-1">
          <div className="col-auto d-flex align-items-center">
            <span className={styles['modal-container__reps-label']}>
              {mode === 'reps' ? 'Reps' : 'Time'}
            </span>
            <span className={styles['modal-container__link-icon']} onClick={handleToggleMode} title="Переключить режим">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </span>
          </div>

          <div className="col-auto d-flex align-items-center gap-1">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className={styles['modal-container__reps-input']}
            />
            {mode === 'time' && <span className={styles['modal-container__seconds-text']}>s.</span>}
          </div>
        </div>

        <div className="row g-0 align-items-end">
          <div className="col pe-3">
            <div className={styles['modal-container__description-plate']}>
              <p>{resolvedDescription || 'Описание техники выполнения этого упражнения отсутствует.'}</p>
            </div>
          </div>
          <div className="col-auto d-flex gap-2">
            <button type="button" className={`${styles['modal-btn']} ${styles['modal-btn--close']}`} onClick={onClose} disabled={submitting}>
              Close
            </button>
            <button type="submit" className={`${styles['modal-btn']} ${styles['modal-btn--save']}`} onClick={handleFormSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
