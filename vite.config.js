import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the React frontend application
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    // Proxy API requests to the Spring Boot backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
