/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

// ИСПРАВЛЕНО: Используем относительный путь для работы через прокси Vite.
// Если прокси не подхватился, браузер отправит запрос на /auth относительно фронтенда,
// что позволит Vite перехватить его.
export const api = axios.create({
  baseURL: 'https://ownthegymapi.onrender.com/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Автоматически прикрепляем JWT-токен к каждому запросу (например, для /auth/me)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ownthegym_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface AuthMeResponse {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

// ИСПРАВЛЕНО ПО СХЕМЕ SWAGGER: меняем token на accessToken и добавляем tokenType
export interface LoginRegisterResponse {
    accessToken: string;
    tokenType: string;
    user: AuthMeResponse;
}
