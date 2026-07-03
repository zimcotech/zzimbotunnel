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

// Handle global Supabase refresh token errors
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('Refresh Token Not Found') || 
    event.reason?.message?.includes('Invalid Refresh Token')
  ) {
    event.preventDefault(); // Suppress the error
    console.warn('Caught background refresh token error. Wiping local auth state.');
    
    // Clear known auth storage items
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.includes('supabase.auth.token')) {
        localStorage.removeItem(k);
      }
    });
    localStorage.removeItem('tun_user_cache');
    
    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
