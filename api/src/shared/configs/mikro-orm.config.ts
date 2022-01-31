import type { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../lib/repositories/base.repository';
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
  highlighter: new SqlHighlighter(),
  entityRepository: BaseRepository,
  logger: ormLogger.log.bind(ormLogger),
  metadataProvider: TsMorphMetadataProvider,
  findOneOrFailHandler: entityName => new NotFoundException(`${entityName} not found`),
} as Options;
