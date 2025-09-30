//최상단 파일

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; //index.css를 항상 불러옴
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
