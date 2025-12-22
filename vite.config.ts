
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Ensuring the dev server runs smoothly on local ports
    port: 5173,
    strictPort: true,
    host: true,
  },
  build: {
    // Professional build settings for the highest performance
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Splitting heavy libraries into separate chunks for faster initial load
          'vendor-react': ['react', 'react-dom'],
          'vendor-animation': ['framer-motion'],
        },
      },
    },
  },
});
