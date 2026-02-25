import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@components': resolve(__dirname, './src/components'),
            '@pages': resolve(__dirname, './src/pages'),
            '@data': resolve(__dirname, './src/data'),
            '@hooks': resolve(__dirname, './src/hooks'),
            '@store': resolve(__dirname, './src/store'),
            '@assets': resolve(__dirname, './src/assets'),
            '@admin': resolve(__dirname, './src/admin'),
            '@services': resolve(__dirname, './src/services'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    base: './',
});
