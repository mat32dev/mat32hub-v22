
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // splitVendorChunkPlugin helps with performance by separating node_modules into a separate bundle
    // This allows for better browser caching of stable dependencies like React and Lucide.
    splitVendorChunkPlugin()
  ],
  define: {
    // Specifically defining individual process.env variables to satisfy the Gemini SDK requirement.
    // This ensures process.env.API_KEY is available in the browser context at build time.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disabled for production to reduce bundle size and protect source logic
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Clean asset names with hashes for effective cache busting and SEO consistency
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
    // Prevent small chunks from being generated to reduce HTTP requests
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true, // Exposed for local network testing
    strictPort: true,
  },
});
