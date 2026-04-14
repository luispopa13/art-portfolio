import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      /* Optimizare PNG */
      png: {
        quality: 80,
      },
      /* Optimizare JPEG */
      jpeg: {
        quality: 80,
      },
      /* Optimizare JPG */
      jpg: {
        quality: 80,
      },
      /* Generează și WebP automat */
      webp: {
        quality: 80,
      },
    }),
  ],
});