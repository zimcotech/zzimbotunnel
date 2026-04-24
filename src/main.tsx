// Prevent Typescript errors from Tawk.to injection variables
declare global {
  interface Window {
    Tawk_API: any;
  }
}

// Prevent Typescript errors from Tawk.to injection variables
declare global {
  interface Window {
    Tawk_API: any;
  }
}

// Prevent Typescript errors from Tawk.to injection variables
declare global {
  interface Window {
    Tawk_API: any;
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
