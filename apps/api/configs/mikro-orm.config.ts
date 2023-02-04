import { config } from './config';
import { allEntities, BaseRepository } from '@okampus/api/dal';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger, NotFoundException } from '@nestjs/common';
import { inspect } from 'node:util';
import type { Options } from '@mikro-orm/core';
// import { MemoryCacheAdapter } from '@mikro-orm/core';
// import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
// import { GlobalSubscriber } from '@api/modules/uaa/statistics/subscribers/content.subscriber';

const ormLogger = new Logger('MikroORM');

export default {
  // autoLoadEntities: true,
  // subscribers: [new GlobalSubscriber()],
  type: 'postgresql',
  entities: allEntities,
  discovery: { disableDynamicFileAccess: true },
  // entities: ['dist/**/*.entity.js'],
  // entitiesTs: ['./src/**/*.entity.ts'],
  seeder: {
    path: 'libs/api/dal/src/shards/seeders',
  },
  dbName: config.database.name,
  user: config.database.user,
  password: config.database.password,
  debug: config.env.isDev(),
  highlighter: new SqlHighlighter(),
  entityRepository: BaseRepository,
  // resultCache: {
  //   adapter: MemoryCacheAdapter,
  //   expiration: 1000,
  // },
  cache: {
    options: {
      cacheDir: 'apps/api/database/temp',
    },
  },
  schemaGenerator: {
    // Prevents error permission denied to set parameter "session_replication_role"
    disableForeignKeys: false, // Try to disable foreign_key_checks (or equivalent)
    createForeignKeyConstraints: true, // Do not generate FK constraints
  },
  migrations: {
    path: 'apps/api/database/migrations',
    disableForeignKeys: false, // Prevents error permission denied to set parameter "session_replication_role"
  },
  logger: ormLogger.log.bind(ormLogger),
  findOneOrFailHandler: (entityName, where) => new NotFoundException(`${entityName} not found at ${inspect(where)}`),

  allowGlobalContext: true,
} as Options;
