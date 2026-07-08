import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.tsx'
import './styles/tokens.css';
import './i18n';

gsap.registerPlugin(ScrollTrigger);
// The default 'load' auto-refresh event recalculates every ScrollTrigger on
// the page (including the pinned Projects track) as soon as window.load
// fires — which on mobile networks lands squarely inside the Hero entrance
// animation and causes a brief hitch. Below-the-fold images are lazy-loaded,
// so we don't need a full-page refresh tied to that event anymore.
ScrollTrigger.config({ autoRefreshEvents: 'DOMContentLoaded,resize,visibilitychange' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
