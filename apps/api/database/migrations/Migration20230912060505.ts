import { Migration } from '@mikro-orm/migrations';

export class Migration20230912060505 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant_member" drop column "start";');

    this.addSql('alter table "team_member" drop column "start";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant_member" add column "start" timestamptz(0) not null default CURRENT_TIMESTAMP;');

    this.addSql('alter table "team_member" add column "start" timestamptz(0) not null default CURRENT_TIMESTAMP;');
  }

}
