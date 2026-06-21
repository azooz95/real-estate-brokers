import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// TWO separate sites built from one codebase (shared theme/i18n/api/components):
//   • Client site  → index.html  → src/entries/client.jsx
//   • Admin site   → admin.html  → src/entries/admin.jsx
//
// In production each is deployed to its OWN domain:
//   client → app.jiwaraloula.com   (serves index.html at /)
//   admin  → admin.jiwaraloula.com (serves admin.html at /)
// Configure your host/CDN so each domain's root rewrites to the right HTML file
// and SPA-fallbacks to it (history API). In dev, the client is at
// http://localhost:5173/ and the admin at http://localhost:5173/admin.html.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        client: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  server: {
    port: 5180,
    strictPort: true,
    proxy: {
      '/api': { target: process.env.VITE_API_TARGET || 'http://localhost:8000', changeOrigin: true },
    },
  },
});
