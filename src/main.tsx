/* eslint-disable @typescript-eslint/no-unused-vars */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  createHashRouter, 
  RouterProvider, 
  type RouteObject 
} from "react-router-dom";

// Импорт страниц приложения
import { MainPage } from './MainPage';
import { Workouts } from './workouts/Workouts';
import { WorkoutViewPage } from './workouts/WorkoutViewPage';
import { SingleWorkoutEditAddPage } from './workouts/SingleWorkoutEditAddPage';
import { ActiveWorkoutPage } from './workouts/ActiveWorkoutPage';
import { ExercisesPage } from './exercises/ExercisesPage';
import { StatisticsPage } from './statistics/StatisticsPage';
import { ChallengesPage } from './challenges/ChallengesPage';
import { SingleChallengePage } from './challenges/SingleChallengePage';
import { ChallengeWorkoutViewPage } from './challenges/ChallengeWorkoutViewPage';
import { ChallengeWorkoutEditAddPage } from './challenges/ChallengeWorkoutEditAddPage';
import { ChallengeEditAddPage } from './challenges/ChallengeEditAddPage';
import { ActiveChallengePage } from './challenges/ActiveChallengePage';
import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';

// ИСПРАВЛЕНО: Импортируем вынесенные компоненты из папки компонентов
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Импорт стилей Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

const routes: RouteObject[] = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  
  {
    path: "/",
    element: <Layout />,
    errorElement: <div className="text-center mt-5 text-white"><h3>404 - Страница не найдена</h3></div>,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/workouts", element: <ProtectedRoute><Workouts /></ProtectedRoute> },
      { path: "/workouts/:workoutId", element: <ProtectedRoute><WorkoutViewPage /></ProtectedRoute> },
      { path: "/workouts/:workoutId/edit", element: <ProtectedRoute><SingleWorkoutEditAddPage /></ProtectedRoute> },
      { path: "/workouts/:workoutId/active", element: <ProtectedRoute><ActiveWorkoutPage /></ProtectedRoute> },
      { path: "/exercises", element: <ProtectedRoute><ExercisesPage /></ProtectedRoute> },
      { path: "/statistics", element: <ProtectedRoute><StatisticsPage /></ProtectedRoute> },
      { path: "/challenges", element: <ProtectedRoute><ChallengesPage /></ProtectedRoute> },
      { path: "/challenges/:challengeId", element: <ProtectedRoute><SingleChallengePage /></ProtectedRoute> },
      { path: "/challenges/:challengeId/workouts/:workoutId", element: <ProtectedRoute><ChallengeWorkoutViewPage /></ProtectedRoute> },
      { path: "/challenges/:challengeId/workouts/:workoutId/edit", element: <ProtectedRoute><ChallengeWorkoutEditAddPage /></ProtectedRoute> },
      { path: "/challenges/new/edit", element: <ProtectedRoute><ChallengeEditAddPage /></ProtectedRoute> },
      { path: "/challenges/:challengeId/edit", element: <ProtectedRoute><ChallengeEditAddPage /></ProtectedRoute> },
      { path: "/challenges/:challengeId/active", element: <ProtectedRoute><ActiveChallengePage /></ProtectedRoute> },
    ]
  }
];

const router = createHashRouter(routes);

const container = document.getElementById('root');
if (!container) {
  throw new Error("Не удалось найти корневой элемент.");
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
