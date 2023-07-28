import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

import viteTsConfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';
import fs from 'node:fs';

const _ = (dir: string) => path.resolve(path.resolve(__dirname, '../../'), dir);

/** @type {import('vite').Plugin} */
const hexLoader = {
  name: 'hex-loader',
  transform(code, id) {
    const [path, query] = id.split('?');
    if (query != 'raw-hex') return null;

    const data = fs.readFileSync(path);
    const hex = data.toString('hex');

    return `export default '${hex}';`;
  },
};

export default defineConfig({
  server: { port: 8081, open: true, hmr: true },
  build: { outDir: _('dist/apps/api') },
  plugins: [
    hexLoader,
    viteTsConfigPaths({
      projects: [
        _('apps/api'),
        _('tsconfig.base.json'),
        _('libs/api/dal'),
        _('libs/api/bll'),
        _('libs/shared/consts'),
        _('libs/shared/enums'),
        _('libs/shared/types'),
        _('libs/shared/utils'),
      ],
    }),
    ...VitePluginNode({
      // Nodejs native Request adapter
      // currently this plugin support 'express', 'nest', 'koa' and 'fastify' out of box,
      // you can also pass a function if you are using other frameworks, see Custom Adapter section
      adapter: 'nest',

      // tell the plugin where is your project entry
      appPath: _('apps/api/src/main.ts'),
      exportName: 'viteNodeApp',
      tsCompiler: 'swc',

      // swc configs, see [swc doc](https://swc.rs/docs/configuration/swcrc)
      swcOptions: {
        jsc: {
          parser: { syntax: 'typescript', dynamicImport: true, decorators: true },
          target: 'es2022',
          transform: { decoratorMetadata: true },
        },
      },
    }),
  ],
  optimizeDeps: {
    // Vite does not work well with optionnal dependencies,
    // you can mark them as ignored for now
    // eg: for nestjs, exlude these optional dependencies:
    exclude: [
      '@apollo/subgraph',
      '@mapbox/node-pre-gyp',
      '@nestjs/mercurius',
      '@nestjs/terminus',
      '@nestjs/microservices',
      '@nestjs/websockets',
      '@node-rs/xxhash',
      'argon2',
      'cache-manager',
      'class-transformer',
      'class-validator',
      'fastify-swagger',
      'fsevents', // Can cause bug on macOS
    ],
  },
});
