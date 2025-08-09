import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: '0.0.0.0',
    hmr: {
      clientPort: 5173,
    },
    allowedHosts: ['i13b201.p.ssafy.io'],
    proxy: {
      '/api': {
        target: 'https://localhost:7443',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist']
        }
      }
    }
  }
})
