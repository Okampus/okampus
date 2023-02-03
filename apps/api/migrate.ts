import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './configs/mikro-orm.config';

console.log('Loading MikroORM...');

(async () => {
  console.log('Initializing MikroORM..');
  const orm = await MikroORM.init(mikroOrmConfig);

  console.log('Starting migration..');
  const migrator = orm.getMigrator();
  await migrator.createMigration();
  await migrator.up();

  await orm.close(true);
})();
