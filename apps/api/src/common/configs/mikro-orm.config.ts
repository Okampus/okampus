import util from 'node:util';
import type { Options } from '@mikro-orm/core';
import { MemoryCacheAdapter } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '@lib/orm/base.repository';
import { config } from './config';

const ormLogger = new Logger('MikroORM');

export default {
  type: 'postgresql',
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  seeder: {
    path: './dist/',
    entitiesTs: './src/',
    glob: '**/*.seeder.{js,ts}',
  },
  debug: config.env.isDev(),
  highlighter: new SqlHighlighter(),
  entityRepository: BaseRepository,
  resultCache: {
    // TODO: Use redis cache?
    adapter: MemoryCacheAdapter,
    expiration: 1000,
  },
  schemaGenerator: {
    // Prevents error permission denied to set parameter "session_replication_role"
    disableForeignKeys: false, // Try to disable foreign_key_checks (or equivalent)
    createForeignKeyConstraints: true, // Do not generate FK constraints
  },
  migrations: {
    disableForeignKeys: false,    // Prevents error permission denied to set parameter "session_replication_role"
  },
  logger: ormLogger.log.bind(ormLogger),
  metadataProvider: TsMorphMetadataProvider,
  findOneOrFailHandler: (entityName, where) => new NotFoundException(`${entityName} not found at ${util.inspect(where)}`),

  allowGlobalContext: true,
} as Options;
