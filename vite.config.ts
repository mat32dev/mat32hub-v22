import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Esto inyecta las variables de entorno necesarias en el código del cliente
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', '@google/genai']
  }
});