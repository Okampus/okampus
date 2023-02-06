import { bootstrap } from './bootstrap/bootstrap';
import { config } from '../configs/config';
import mikroOrmConfig from '../configs/mikro-orm.config';
import { Logger } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { exit } from 'node:process';

const logger = new Logger('Bootstrap');

const initApp = async () => {
  if (process.env.MIKRO_ORM_MIGRATION) {
    logger.log('Initializing MikroORM..');
    let orm;
    switch (process.env.MIKRO_ORM_MIGRATION) {
      case 'create': {
        logger.log('Creating migration..');
        orm = await MikroORM.init(mikroOrmConfig);
        const migrator = orm.getMigrator();
        await migrator.createMigration();
        break;
      }
      case 'up': {
        logger.log('Migrating up..');
        orm = await MikroORM.init({
          ...mikroOrmConfig,
          migrations: { ...mikroOrmConfig.migrations, path: 'dist/apps/api/database/migrations' },
        });
        const migrator = orm.getMigrator();
        await migrator.up();
        break;
      }
      case 'down': {
        logger.log('Migrating down..');
        orm = await MikroORM.init(mikroOrmConfig);
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
    const app = await bootstrap(logger);

    await app.listen(config.network.port, '0.0.0.0');
    const url = await app.getUrl();
    logger.log(`API running on: ${url.replace('[::1]', 'localhost')}`);
    logger.log('🚀 API is ready!\n');
    return app;
  } else {
    return bootstrap(logger);
  }
};

export const viteNodeApp = initApp();
