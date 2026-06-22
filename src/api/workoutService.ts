import { api } from './authService';

export type WorkoutLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'INSANE';
export type WorkoutType = 'TYPICAL' | 'SPECIAL';

export interface WorkoutSetGet {
    id: string;
    exerciseId: string;
    exerciseTitle: string;
    numberOfReps: number;
    amountOfTime: number;
}

export interface WorkoutSetPost {
    exerciseId: string;
    numberOfReps: number;
    amountOfTime: number;
}

export interface WorkoutItem {
    id: string;
    title: string;
    description: string;
    level: WorkoutLevel;
    type: WorkoutType;
    sets: WorkoutSetGet[];
}

export interface WorkoutCreateUpdatePayload {
    title: string;
    description: string;
    level: WorkoutLevel;
    type: WorkoutType;
    sets: WorkoutSetPost[];
}

export interface ExerciseResponse {
    id: string; // uuid
    title: string;
    description: string;
    videoUrl: string;
}

export interface ExerciseRequest {
    title: string;
    description: string;
    videoUrl: string;
}

export interface ChallengeItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    workouts: WorkoutItem[]; // Вложенный массив тренировок типа SPECIAL
}

export interface ChallengeCreateUpdatePayload {
    title: string;
    description: string;
    imageUrl: string;
    workoutIds: string[]; // Бэкенд обычно ожидает массив ID привязанных тренировок
}

export interface StatWorkoutInfo {
    id: string;
    title: string;
    level: string;
}

export interface StatChallengeInfo {
    id: string;
    title: string;
}

export interface StatEntryItem {
    id: string;
    day: string; // ISO дата выполнения
    type: 'WORKOUT' | 'CHALLENGE';
    workout: StatWorkoutInfo | null;
    challenge: StatChallengeInfo | null;
}

export interface StatisticsResponse {
    workoutDaysCount: number;
    challengeDaysCount: number;
    entries: StatEntryItem[];
}

interface LocalCalendarEntry {
    day: string; // Формат даты "YYYY-MM-DD"
    type: 'WORKOUT' | 'CHALLENGE';
}

interface CalendarWeekResponse {
    period: string;
    year: number | null;
    month: number | null;
    startDate: string;
    endDate: string;
    entries: LocalCalendarEntry[]; // Использует объявленный выше тип без конфликтов
}

interface DayColumn {
    label: string;      // S, M, T, W, T, F, S
    dateStr: string;    // "2026-06-22"
    dayNumber: number;  // 22
}

export const workoutService = {
    // Получить все тренировки типа TYPICAL (обычные)
    getTypicalWorkouts: async () => {
        const response = await api.get<WorkoutItem[]>('/workouts/typical');
        return response.data;
    },

    // Получить конкретную тренировку по ID
    getWorkoutById: async (id: string) => {
        const response = await api.get<WorkoutItem>(`/workouts/${id}`);
        return response.data;
    },

    // Создать тренировку
    createWorkout: async (payload: WorkoutCreateUpdatePayload) => {
        const response = await api.post<WorkoutItem>('/workouts', payload);
        return response.data;
    },

    // Редактировать тренировку
    updateWorkout: async (id: string, payload: WorkoutCreateUpdatePayload) => {
        // Строго шлем PUT запрос на /workouts/{id} по вашей схеме Swagger
        const response = await api.put<WorkoutItem>(`/workouts/${id}`, payload);
        return response.data;
    },

    // Удалить тренировку
    deleteWorkout: async (id: string) => {
        await api.delete(`/workouts/${id}`);
    },

    getAllExercises: async () => {
        const response = await api.get<ExerciseResponse[]>('/exercises');
        return response.data;
    },

    // 2. Получить конкретное упражнение по ID (если понадобится для деталей)
    getExerciseById: async (id: string) => {
        const response = await api.get<ExerciseResponse>(`/exercises/${id}`);
        return response.data;
    },

    // POST /exercises — Создать новое упражнение
    createExercise: async (payload: ExerciseRequest) => {
        const response = await api.post<ExerciseResponse>('/exercises', payload);
        return response.data;
    },

    // PUT /exercises/{id} — Обновить существующее упражнение
    updateExercise: async (id: string, payload: ExerciseRequest) => {
        const response = await api.put<ExerciseResponse>(`/exercises/${id}`, payload);
        return response.data;
    },

    // DELETE /exercises/{id} — Удалить упражнение по ID
    deleteExercise: async (id: string) => {
        await api.delete(`/exercises/${id}`);
    },

    completeWorkout: async (id: string) => {
        // Генерируем текущее время в строгом формате ISO, который ожидает бэкенд
        const payload = {
            day: new Date().toISOString()
        };

        console.log(`=== [ОТПРАВКА POST /workouts/${id}/complete] ===`, payload);
        const response = await api.post(`/workouts/${id}/complete`, payload);
        return response.data;
    },

    getAllChallenges: async () => {
        const response = await api.get<ChallengeItem[]>('/challenges');
        return response.data;
    },

    getSpecialWorkouts: async () => {
        // Запрашиваем общий эндпоинт, который точно существует
        const response = await api.get<WorkoutItem[]>('/workouts');
        const data = response.data;

        // ИСПРАВЛЕНО НА 100%: Фильтруем данные прямо на фронтенде по вашей схеме Swagger
        return Array.isArray(data) ? data.filter((w) => w.type === 'SPECIAL') : [];
    },

    createChallenge: async (payload: ChallengeCreateUpdatePayload) => {
        const response = await api.post<ChallengeItem>('/challenges', payload);
        return response.data;
    },

    // PUT /challenges/{id} — Обновить челлендж
    updateChallenge: async (id: string, payload: ChallengeCreateUpdatePayload) => {
        const response = await api.put<ChallengeItem>(`/challenges/${id}`, payload);
        return response.data;
    },

    getStatistics: async () => {
        const response = await api.get<StatisticsResponse>('/statistics');
        return response.data;
    },

    getCalendarWeek: async (dateStr: string) => {
        const response = await api.get<CalendarWeekResponse>(`/calendar/week?date=${dateStr}`);
        return response.data;
    },

    // GET /calendar/month?year=YYYY&month=M (Месяц от 1 до 12)
    getCalendarMonth: async (year: number, month: number) => {
        const response = await api.get<CalendarWeekResponse>(`/calendar/month?year=${year}&month=${month}`);
        return response.data;
    }
};
