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
        const response = await api.post(`/workouts/${id}/complete`, {});
        return response.data;
    },

};
