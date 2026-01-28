import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': { // maybe fix.
        target: 'http://localhost:3001', // maybe fix.
        changeOrigin: true, // maybe fix.
      }
    }
  },
  build: {
    outDir: 'build'
  }
})
