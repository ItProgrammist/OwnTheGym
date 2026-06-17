/* eslint-disable @typescript-eslint/no-unused-vars */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MainPage } from './MainPage';
import { Workouts } from './workouts/Workouts'
import { SingleWorkoutPage } from './workouts/SingleWorkoutPage'
import { SingleWorkoutEditAddPage } from './workouts/SingleWorkoutEditAddPage';

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
  { path: "/workouts/:workoutId", element: <SingleWorkoutPage />, errorElement: <div>404</div>  },
  { path: "/workouts/:workoutId/edit", element: <SingleWorkoutEditAddPage />, errorElement: <div>404</div>  }

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
