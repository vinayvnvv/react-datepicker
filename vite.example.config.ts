import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: 'dev',
  build: {
    outDir: '../distExamples',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'dev/index.html'),
    },
  },
  plugins: [react()],
  // base: '/react-datepicker/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@src': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
    open: true,
  },
})
