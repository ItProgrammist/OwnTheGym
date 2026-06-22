/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

// юзаем относительный путь для работы через прокси Vite.
// и если прокси не подхватился, браузер отправит запрос на /auth относительно фронтенда,
// это позволит Vite перехватить его.
export const api = axios.create({
  baseURL: 'https://ownthegymapi.onrender.com/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

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
