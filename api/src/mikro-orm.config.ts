import type { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Logger } from '@nestjs/common';
import { config } from './config';

const ormLogger = new Logger('MikroORM');

export default {
  migrations: {
    path: './migrations',
  },
  type: 'postgresql',
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  debug: config.get('nodeEnv') === 'development',
  logger: ormLogger.log.bind(ormLogger),
  metadataProvider: TsMorphMetadataProvider,
} as Options;
