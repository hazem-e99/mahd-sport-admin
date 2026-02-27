import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router";
import './i18n';
import './index.css';
import Router from './routes.tsx';
import './styles/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={Router} />
  </StrictMode>
)
