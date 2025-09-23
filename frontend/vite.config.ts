import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath, URL } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Server-side env access for config
const isDev = process.env.NODE_ENV === 'development'
const apiTarget = process.env.VITE_API_TARGET || (isDev ? 'http://localhost:8080' : 'http://backend:8080')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  esbuild: {
    target: 'es2022',
  },
})
