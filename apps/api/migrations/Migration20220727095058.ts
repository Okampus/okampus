import { Migration } from '@mikro-orm/migrations';

export class Migration20220727095058 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "bot" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "bot";');
  }

}
