import { config } from './config';
import { allEntities, BaseRepository } from '@okampus/api/dal';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger, NotFoundException } from '@nestjs/common';
import { MemoryCacheAdapter } from '@mikro-orm/core';
import type { Options } from '@mikro-orm/core';

const ormLogger = new Logger('MikroORM');

const mikroOrmConfig: Options = {
  type: 'postgresql',
  entities: allEntities,
  discovery: { disableDynamicFileAccess: true },
  host: config.database.host,
  dbName: config.database.name,
  user: config.database.user,
  password: config.database.password,
  port: config.database.port,
  debug: config.env.isDev(),
  highlighter: new SqlHighlighter(),
  entityRepository: BaseRepository,
  resultCache: { adapter: MemoryCacheAdapter, expiration: 1000 },
  cache: { options: { cacheDir: 'apps/api/database/temp' } },
  schemaGenerator: {
    // Disables foreign_key_checks to prevent error permission denied setting parameter "session_replication_role"
    disableForeignKeys: false,
    createForeignKeyConstraints: true, // Do not generate FK constraints
  },
  migrations: {
    // Disables foreign_key_checks to prevent error permission denied setting parameter "session_replication_role"
    disableForeignKeys: false,
    path: 'apps/api/database/migrations',
  },
  allowGlobalContext: true,
  logger: ormLogger.log.bind(ormLogger),
  findOneOrFailHandler: (entityName, where) =>
    new NotFoundException(`${entityName} not found at ${JSON.stringify(where)}`),
};

export default mikroOrmConfig;
