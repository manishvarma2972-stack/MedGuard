import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      allowedHosts: true,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_TARGET || 'https://medguard-d48g.onrender.com',
          changeOrigin: true,
          secure: true,
          headers: {
            Origin: 'https://medguard-frontend.onrender.com',
          },
        },
        '/storage': {
          target: env.VITE_BACKEND_TARGET || 'https://medguard-d48g.onrender.com',
          changeOrigin: true,
          secure: true,
        },
      }
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            pdf: ['jspdf', 'jspdf-autotable'],
            icons: ['lucide-react'],
          }
        }
      }
    }
  }
})
