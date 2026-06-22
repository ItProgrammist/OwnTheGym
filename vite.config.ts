import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'



// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      // Каждый раз, когда фронтенд отправляет запрос на /auth или /api, 
      // Vite будет прозрачно перенаправлять его на бэкенд 5050
      '/auth': {
        target: 'https://ownthegymapi.onrender.com/',
        changeOrigin: true,
        secure: false,
      },
      '/exercises': {
        target: 'https://ownthegymapi.onrender.com/',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://ownthegymapi.onrender.com/',
        changeOrigin: true,
        secure: false,
      },
      '/workouts': {
        target: 'https://ownthegymapi.onrender.com/',
        changeOrigin: true,
        secure: false,
      },
      '/statistics': {
        target: 'https://ownthegymapi.onrender.com/',
        changeOrigin: true,
        secure: false,
      },
      '/calendar': {
        target: 'https://ownthegymapi.onrender.com/',
        changeOrigin: true,
        secure: false,
      },
      '/challenges': {
        target: 'https://ownthegymapi.onrender.com/', // Без trailing-слеша на конце!
        changeOrigin: true,
        secure: false,
        ws: true, // Включает проброс заголовков для сложных HTTP-методов
      }, 
    },
  },
})

