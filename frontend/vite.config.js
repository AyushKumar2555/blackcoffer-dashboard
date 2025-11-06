// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // Ye line important hai

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // Tailwind plugin directly yahan
  ],
  server: {
    proxy: {
      '/api': {
        target: 'YOUR_BACKEND_URL', // Replace with your backend URL
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
