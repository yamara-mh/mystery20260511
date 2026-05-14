import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mystery20260511/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
})
