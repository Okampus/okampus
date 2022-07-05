import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            mode: 'development',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            registerType: 'autoUpdate',
            strategies: 'injectManifest',
            manifest: {
                name: 'Okampus',
                short_name: 'Okampus',
                description: 'Votre campus en ligne',
                theme_color: '#1e293b',
                icons: [
                    {
                        src: 'icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
            devOptions: {
                enabled: true,
                type: 'autoUpdate',
                autoUpdate: {
                    enabled: true,
                    interval: 60,
                    retry: 3,
                },
            },
        }),
    ],
    resolve: { alias: { '@': resolve(__dirname, 'src') } },
    server: { open: true },
})
