import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'playground',
  build: {
    target: 'esnext',
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/imagine.ts'),
      formats: ['es', 'iife', 'umd'],
      name: 'imagine',
    },
  },
});
