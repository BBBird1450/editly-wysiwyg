import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/editly-wysiwyg/',
  build: {
    outDir: '../docs'
  },
  resolve: {
    alias: {
      'editly-wysiwyg': '../src'
    }
  }
});