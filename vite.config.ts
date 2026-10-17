import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE lets the same build run at a sub-path (GitHub Pages: /unlockdrill/) or at the root of a custom domain.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
