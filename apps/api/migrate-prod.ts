import mikroOrmConfig from './configs/mikro-orm.config';
import { MikroORM } from '@mikro-orm/core';
import { basename } from 'node:path';

console.log('Loading MikroORM...');

(async () => {
  console.log('Loading migrations..');
  const migrations = {};

  function importAll(r) {
    for (const key of r.keys()) migrations[basename(key)] = Object.values(r(key))[0];
  }

  importAll(require.context('./database/migrations', false, /\.ts$/));

  const migrationsList = Object.keys(migrations).map((migrationName) => ({
    name: migrationName,
    class: migrations[migrationName],
  }));

  console.log('Initializing MikroORM..');
  const orm = await MikroORM.init({
    ...mikroOrmConfig,
    migrations: {
      migrationsList,
      snapshot: false,
      path: 'apps/api/database/migrations',
      disableForeignKeys: false, // Prevents error permission denied to set parameter "session_replication_role"
    },
  });

  console.log('Starting migration..');
  const migrator = orm.getMigrator();
  await migrator.createMigration();
  await migrator.up();

  await orm.close(true);
})();
