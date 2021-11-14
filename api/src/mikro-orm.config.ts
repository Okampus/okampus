import type { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';
import { config } from './config';
import { BaseRepository } from './shared/lib/repositories/base.repository';

const ormLogger = new Logger('MikroORM');

export default {
  migrations: {
    path: './migrations',
  },
  type: 'postgresql',
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  debug: config.get('nodeEnv') === 'development',
  highlighter: new SqlHighlighter(),
  entityRepository: BaseRepository,
  logger: ormLogger.log.bind(ormLogger),
  metadataProvider: TsMorphMetadataProvider,
} as Options;
