import { bootstrap } from './bootstrap/bootstrap';
import { config } from './configs/config';
import mikroOrmConfig from './configs/mikro-orm.config';

import { MikroORM } from '@mikro-orm/core';

import { Logger, PinoLogger } from 'nestjs-pino';
import pino from 'pino-http';

import { exit } from 'node:process';
import type { LogContext, LoggerNamespace, Logger as MikroOrmLogger } from '@mikro-orm/core';

const pinoHttp = pino();
const pinoLogger = new PinoLogger({ pinoHttp });
const logger = new Logger(pinoLogger, {});

const MIGRATION_CREATE = 'create';
const MIGRATION_UP = 'up';
const MIGRATION_DOWN = 'down';

const loggerFactory = (): MikroOrmLogger => {
  const logger = new Logger(pinoLogger, {});
  return {
    log: (namespace: LoggerNamespace, message: string, context?: LogContext | undefined) => {
      if (context) {
        logger.log(`[${namespace}] ${message} ${JSON.stringify(context)}`);
      } else {
        logger.log(`[${namespace}] ${message}`);
      }
    },
    error: (namespace: LoggerNamespace, message: string, context?: LogContext | undefined) => {
      if (context) {
        logger.error(`[${namespace}] ${message} ${JSON.stringify(context)}`);
      } else {
        logger.error(`[${namespace}] ${message}`);
      }
    },
    warn: (namespace: LoggerNamespace, message: string, context?: LogContext | undefined) => {
      if (context) {
        logger.warn(`[${namespace}] ${message} ${JSON.stringify(context)}`);
      } else {
        logger.warn(`[${namespace}] ${message}`);
      }
    },
    logQuery: (context: LogContext) => {
      logger.log(`[query] ${context.query} ${JSON.stringify(context.params)}`);
    },
    isEnabled: () => true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setDebugMode: () => {},
  };
};

const initApp = async () => {
  if (process.env.MIKRO_ORM_MIGRATION) {
    logger.log('Initializing MikroORM..');
    let orm;
    switch (process.env.MIKRO_ORM_MIGRATION) {
      case MIGRATION_CREATE: {
        logger.log('Creating migration..');
        orm = await MikroORM.init({ ...mikroOrmConfig, loggerFactory });
        const migrator = orm.getMigrator();
        await migrator.createMigration();
        break;
      }
      case MIGRATION_UP: {
        logger.log('Migrating up..');
        orm = await MikroORM.init({
          ...mikroOrmConfig,
          migrations: { ...mikroOrmConfig.migrations, path: 'dist/apps/api/database/migrations' },
          loggerFactory,
        });
        const migrator = orm.getMigrator();
        await migrator.up();
        break;
      }
      case MIGRATION_DOWN: {
        logger.log('Migrating down..');
        orm = await MikroORM.init({ ...mikroOrmConfig, loggerFactory });
        const migrator = orm.getMigrator();
        await migrator.down();
        break;
      }
      default: {
        logger.error('Unknown migration command');
        exit(101);
      }
    }

    await orm.close(true);
    exit(0);
  } else if (import.meta.env.PROD) {
    logger.log('✨ Starting in production mode!\n');
    // @ts-expect-error - @nestjs-pino is not up to date with @nestjs/common
    const app = await bootstrap(logger);

    await app.listen(config.network.port, '0.0.0.0');
    const url = await app.getUrl();
    logger.log(`API running on: ${url.replace('[::1]', 'localhost')}`);
    logger.log('🚀 API is ready!\n');
    return app;
  } else {
    // @ts-expect-error - @nestjs-pino is not up to date with @nestjs/common
    return bootstrap(logger);
  }
};

export const viteNodeApp = initApp();
