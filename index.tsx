import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

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
    container.innerHTML = `<div style="color:white; padding:40px; font-family:sans-serif; background:#1c1917; min-height:100vh;">
      <h2 style="color:#ea580c">Mat32 System Error</h2>
      <p>No se pudo inicializar la interfaz. Detalles:</p>
      <pre style="font-size:12px; color:#666; background:#000; padding:20px; border-radius:10px; overflow:auto;">${error}</pre>
    </div>`;
  }
}