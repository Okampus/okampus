import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, '../../libs/assets/src'),
    },
  },

  server: {
    port: 4200,
    host: 'localhost',
  },

  plugins: [
    react(),
    viteTsConfigPaths({
      projects: [
        '../../apps/site',
        '../../tsconfig.base.json',
        '../../libs/ui/atoms',
        '../../libs/ui/hooks',
        '../../libs/ui/molecules',
        '../../libs/ui/organisms',
        '../../libs/ui/templates',
        '../../libs/site/shards',
      ],
    }),
    svgr(),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  define: {
    'import.meta.vitest': undefined,
  },
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    includeSource: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
