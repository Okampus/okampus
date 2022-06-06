import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [vue()],
    resolve: { alias: { '@': resolve(__dirname, 'src') } },
    server: { open: true },
})
