import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("FATAL ERROR:", error);
    container.innerHTML = '<div style="color:white; padding:40px; font-family:sans-serif; background:#1c1917;"><h1>Initialization Error</h1><p>Unable to load the application. Please refresh the page or contact support.</p></div>';
  }
} else {
  console.error('Root element not found');
}
