import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app.jsx';
import aboutpic from './images/aboutpic.jpg';
import './main.css';

// fetch and decode the portrait up front so the About page never
// stalls a frame on it
const preloadImg = new Image();
preloadImg.src = aboutpic;
preloadImg.decode().catch(() => {});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
