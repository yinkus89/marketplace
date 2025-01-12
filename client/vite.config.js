// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jwt-decode']  // Add this line to optimize jwt-decode
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/globalStyles.scss";`  // Adjust path if necessary
      },
    },
  },
});
