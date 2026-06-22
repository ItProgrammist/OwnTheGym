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
    workouts: WorkoutItem[];
}

export interface ChallengeCreateUpdatePayload {
    title: string;
    description: string;
    imageUrl: string;
    workoutIds: string[];
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
    day: string;
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


export const workoutService = {

    getTypicalWorkouts: async () => {
        const response = await api.get<WorkoutItem[]>('/workouts/typical');
        return response.data;
    },


    getWorkoutById: async (id: string) => {
        const response = await api.get<WorkoutItem>(`/workouts/${id}`);
        return response.data;
    },


    createWorkout: async (payload: WorkoutCreateUpdatePayload) => {
        const response = await api.post<WorkoutItem>('/workouts', payload);
        return response.data;
    },


    updateWorkout: async (id: string, payload: WorkoutCreateUpdatePayload) => {
        const response = await api.put<WorkoutItem>(`/workouts/${id}`, payload);
        return response.data;
    },


    deleteWorkout: async (id: string) => {
        await api.delete(`/workouts/${id}`);
    },

    getAllExercises: async () => {
        const response = await api.get<ExerciseResponse[]>('/exercises');
        return response.data;
    },


    getExerciseById: async (id: string) => {
        const response = await api.get<ExerciseResponse>(`/exercises/${id}`);
        return response.data;
    },


    createExercise: async (payload: ExerciseRequest) => {
        const response = await api.post<ExerciseResponse>('/exercises', payload);
        return response.data;
    },


    updateExercise: async (id: string, payload: ExerciseRequest) => {
        const response = await api.put<ExerciseResponse>(`/exercises/${id}`, payload);
        return response.data;
    },


    deleteExercise: async (id: string) => {
        await api.delete(`/exercises/${id}`);
    },

    completeWorkout: async (id: string) => {

        const payload = {
            day: new Date().toISOString()
        };

        console.log(`=== [ОТПРАВКА POST /workouts/${id}/complete] ===`, payload);
        const response = await api.post(`/workouts/${id}/complete`, payload);
        return response.data;
    },

    completeChallenge: async (id: string) => {

        const payload = {
            day: new Date().toISOString()
        };

        console.log(`=== [ОТПРАВКА POST /challenges/${id}/complete] ===`, payload);
        const response = await api.post(`/challenges/${id}/complete`, payload);
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
    },

    deleteChallenge: async (id: string) => {
        const response = await api.delete(`/challenges/${id}`);
        return response.data;
    }
};
