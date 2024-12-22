import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        menu: './Menu.html',
        about: './addProduct.html',
        contact: './maksu.html',
        QR: './QR.html',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf}'],
        // Allow dynamic routing with specific patterns like /Menu.html?id=...
        navigateFallback: '/index.html', // Fallback to index.html for SPA-like behavior
        navigateFallbackAllowlist: [
          // Regular expression to allow /Menu.html and any query parameters
          /^\/Menu.html\?.*/,
          /^\/index.html$/, // Allow the base index.html route
        ],
      },
      includeAssets: ['app-icon.svg', 'main.css', 'Pacifico-Regular.ttf'],
      manifest: {
        name: 'vite pwa example',
        short_name: 'vite-pwa',
        description: 'example for vite pwa plugin',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
