/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import styles from './scss/UpsertExerciseModal.module.scss';
import { type ExerciseResponse, type ExerciseRequest } from '../api/workoutService';
import { getVideoEmbedLink } from '../utils/videoEmbed';

interface UpsertExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: ExerciseRequest) => Promise<void>;
    exercise: ExerciseResponse | null;
}

export const UpsertExerciseModal: React.FC<UpsertExerciseModalProps> = ({
    isOpen,
    onClose,
    onSave,
    exercise,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setIsPlaying(false);
            if (exercise) {
                setTitle(exercise.title);
                setDescription(exercise.description || '');
                setVideoUrl(exercise.videoUrl || '');
            } else {
                setTitle('');
                setDescription('');
                setVideoUrl('');
            }
        }
    }, [isOpen, exercise]);

    if (!isOpen) return null;

    const embedLink = getVideoEmbedLink(videoUrl);
    const isLinkValid = embedLink.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            setSubmitting(true);
            await onSave({
                title: title.trim(),
                description: description.trim(),
                videoUrl: videoUrl.trim(),
            });
            onClose();
        } catch (err) {
            alert('Не удалось сохранить изменения.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles['modal-overlay']} onClick={onClose}>
            <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>

                {/* Инпут Названия упражнения */}
                <div className="mb-3">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles['modal-container__title-input']}
                        placeholder="Exercise name..."
                        required
                    />
                </div>

                {/* УНИВЕРСАЛЬНЫЙ ИНТЕРАКТИВНЫЙ ВИДЕОПЛЕЕР */}
                <div className={styles['video-player']}>
                    {isPlaying && isLinkValid ? (
                        /* Один общий iframe, который теперь воспроизводит и YouTube, и Google Диск */
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
                        /* Если формат ссылки вообще не распознан */
                        <div className="d-flex flex-column align-items-center justify-content-center h-100 p-3 text-center bg-black">
                            <p className="small text-white-50 mb-2">Неподдерживаемый формат ссылки.</p>
                            <a href={videoUrl.trim()} target="_blank" rel="noopener noreferrer" className="text-info small">
                                Открыть в новой вкладке
                            </a>
                        </div>
                    ) : (
                        /* Состояние Превью (до клика на Play) */
                        <React.Fragment>
                            <img src="/placeholder.png" alt="Preview" className={styles['video-player__thumbnail']} />
                            <button
                                type="button"
                                className={styles['video-player__play-btn']}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsPlaying(true);
                                }}
                                disabled={!videoUrl.trim()}
                                style={{ opacity: videoUrl.trim() ? 1 : 0.4, cursor: videoUrl.trim() ? 'pointer' : 'not-allowed' }}
                            >
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M8 5v14l11-7z" fill="#3b82f6" />
                                </svg>
                            </button>
                        </React.Fragment>
                    )}
                </div>

                {/* Панель ввода ссылки */}
                <div className="row g-0 align-items-center justify-content-between mb-3 px-1 gap-2">
                    <div className="col-auto d-flex align-items-center">
                        <div className={styles['modal-container__video-btn-label']}>
                            <span>Edit/Add Video</span>
                            <svg viewBox="0 0 24 24" fill="none" className="ms-2 d-inline-block" style={{ width: '1.25rem' }}>
                                <rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 17l1.5.3L16 9.8l-2.5-2.5L6 14.8l1 2.2zM12.5 6.3l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => {
                                setVideoUrl(e.target.value);
                                setIsPlaying(false);
                            }}
                            placeholder="Paste YouTube or Google Drive link here..."
                            className={styles['modal-container__video-input']}
                        />
                    </div>
                </div>

                {/* Секция текстового описания и кнопок */}
                <div className="row g-0 align-items-end">
                    <div className="col pe-3">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles['modal-container__description-textarea']}
                            placeholder="Add an exercise description..."
                            rows={3}
                        />
                    </div>
                    <div className="col-auto d-flex gap-2">
                        <button type="button" className={`${styles['modal-btn']} ${styles['modal-btn--close']}`} onClick={onClose} disabled={submitting}>
                            Close
                        </button>
                        <button type="button" className={`${styles['modal-btn']} ${styles['modal-btn--save']}`} onClick={handleSubmit} disabled={submitting || !title.trim()}>
                            Save
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
