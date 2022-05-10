import type { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger, NotFoundException } from '@nestjs/common';
import { BaseNamingStrategy } from '../lib/orm/base.naming-strategy';
import { BaseRepository } from '../lib/orm/base.repository';
import { config } from './config';

const ormLogger = new Logger('MikroORM');

export default {
  type: 'postgresql',
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  debug: config.get('nodeEnv') === 'development',
  highlighter: new SqlHighlighter(),
  entityRepository: BaseRepository,
  namingStrategy: BaseNamingStrategy,
  logger: ormLogger.log.bind(ormLogger),
  metadataProvider: TsMorphMetadataProvider,
  findOneOrFailHandler: entityName => new NotFoundException(`${entityName} not found`),
} as Options;
