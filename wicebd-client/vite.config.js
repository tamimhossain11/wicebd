import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — smallest, loaded first
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // MUI — large, keep isolated so it caches independently
          if (id.includes('node_modules/@mui/')) {
            return 'mui';
          }
          // Framer Motion
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          // Everything else in node_modules → vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
      },
    },
    // Raise the warning threshold slightly — MUI is legitimately large
    chunkSizeWarningLimit: 700,
  },
})
