import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';

import viteTsConfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

import dns from 'node:dns';

dns.setDefaultResultOrder('verbatim');

const _ = (dir: string) => path.resolve(path.resolve(__dirname, '../../'), dir);

const allow = [_('libs/assets/src'), _('apps/site/src')];

export default defineConfig({
  root: _('apps/site'),
  resolve: { alias: { '@assets': _('libs/assets/src') } },
  server: { port: 4200, fs: { allow }, open: true, hmr: true },
  build: { outDir: _('dist/apps/site') },
  define: { 'import.meta.vitest': undefined },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },
  plugins: [
    react(),
    viteTsConfigPaths({
      projects: [
        _('tsconfig.base.json'),
        _('apps/site'),
        _('libs/ui/atoms'),
        _('libs/ui/hooks'),
        _('libs/ui/molecules'),
        _('libs/ui/organisms'),
        _('libs/ui/templates'),
        _('libs/ui/utils'),
      ],
    }),
    svgr(),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    passWithNoTests: true,
    cache: { dir: _('node_modules/.vitest') },
    coverage: { reportsDirectory: _('coverage/apps/site') },
    include: [_('apps/site/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}')],
    includeSource: [_('apps/site/src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}')],
  },
});
