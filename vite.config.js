import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Your App Name',
        short_name: 'App',
        description: 'Your App Description',
        theme_color: '#c0404a',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '1024x1024',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '1024x1024',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            "src": "screenshot1.png",
            "sizes": "480x480",
            "type": "image/png",
            "form_factor": "wide"
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
});
