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
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
      },
      '/exercises': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
      },
      '/workouts': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
      },
      '/statistics': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
      },
      '/calendar': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

