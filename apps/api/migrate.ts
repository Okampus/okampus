import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './configs/mikro-orm.config';

(async () => {
  const orm = await MikroORM.init(mikroOrmConfig);

  const migrator = orm.getMigrator();
  await migrator.createMigration();
  await migrator.up();

  await orm.close(true);
})();
