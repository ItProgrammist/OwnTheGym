/* eslint-disable @typescript-eslint/no-unused-vars */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MainPage } from './MainPage';
import { Workouts } from './workouts/Workouts'
import { WorkoutViewPage } from './workouts/WorkoutViewPage'
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

// import './index.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  createHashRouter,
  RouterProvider,
  type RouteObject
} from "react-router-dom";


const routes: RouteObject[] = [
  { path: "/", element: <MainPage />, errorElement: <div>404</div> },
  { path: "/workouts", element: <Workouts />, errorElement: <div>404</div> },
  { path: "/workouts/:workoutId", element: <WorkoutViewPage />, errorElement: <div>404</div> },
  { path: "/workouts/:workoutId/edit", element: <SingleWorkoutEditAddPage />, errorElement: <div>404</div> },
  { path: "/workouts/:workoutId/active", element: <ActiveWorkoutPage /> },
  { path: "/exercises", element: <ExercisesPage /> },
  { path: "/statistics", element: <StatisticsPage /> },
  { path: "/challenges", element: <ChallengesPage /> },
  { path: "/challenges/:challengeId", element: <SingleChallengePage /> },
  { path: "/challenges/:challengeId/workouts/:workoutId", element: <ChallengeWorkoutViewPage /> },
  { path: "/challenges/:challengeId/workouts/:workoutId/edit", element: <ChallengeWorkoutEditAddPage /> },
  { path: "/challenges/new/edit", element: <ChallengeEditAddPage /> },
  { path: "/challenges/:challengeId/edit", element: <ChallengeEditAddPage /> },
  { path: "/challenges/:challengeId/active", element: <ActiveChallengePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
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
