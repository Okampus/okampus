import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: { port: 8081 },
  plugins: [
    viteTsConfigPaths({
      projects: [
        '../../apps/api',
        '../../tsconfig.base.json',
        '../../libs/api/dal',
        '../../libs/api/bll',
        '../../libs/shared/consts',
        '../../libs/shared/dtos',
        '../../libs/shared/enums',
        '../../libs/shared/types',
        '../../libs/shared/utils',
      ],
    }),
    ...VitePluginNode({
      // Nodejs native Request adapter
      // currently this plugin support 'express', 'nest', 'koa' and 'fastify' out of box,
      // you can also pass a function if you are using other frameworks, see Custom Adapter section
      adapter: 'nest',

      // tell the plugin where is your project entry
      appPath: './src/main.ts',

      exportName: 'viteNodeApp',

      tsCompiler: 'swc',

      // swc configs, see [swc doc](https://swc.rs/docs/configuration/swcrc)
      swcOptions: {
        jsc: {
          parser: {
            syntax: 'typescript',
            dynamicImport: true,
            decorators: true,
          },
          target: 'es2022',
          transform: {
            decoratorMetadata: true,
          },
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
      'cache-manager',
      'class-transformer',
      'class-validator',
      'fastify-swagger',
    ],
  },
});
