import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    devSourcemap: true,
  },
  build: {
    // Let Vite/Rollup handle vendor chunking automatically — manual splitting
    // causes React.createContext to be undefined when peer deps load out of order.
    // The real perf win is already in place via React.lazy route splitting.
    chunkSizeWarningLimit: 700,
  },
})
