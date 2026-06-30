import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// On GitHub Pages the app is served from /<repo>/, so the production build
// needs that base path. Local dev stays at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Bangladesh-Football-Federation/' : '/',
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
}));
