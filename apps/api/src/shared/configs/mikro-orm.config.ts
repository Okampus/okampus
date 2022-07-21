import util from 'node:util';
import type { Options } from '@mikro-orm/core';
import { MemoryCacheAdapter } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger, NotFoundException } from '@nestjs/common';
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
  resultCache: {
    // TODO: Use redis cache?
    adapter: MemoryCacheAdapter,
    expiration: 1000,
  },
  logger: ormLogger.log.bind(ormLogger),
  metadataProvider: TsMorphMetadataProvider,
  findOneOrFailHandler: (entityName, where) => new NotFoundException(`${entityName} not found at ${util.inspect(where)}`),
} as Options;
