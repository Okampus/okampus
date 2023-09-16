import { Migration } from '@mikro-orm/migrations';

export class Migration20230916093705 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant_member" drop column "permissions";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant_member" add column "permissions" int not null default 0;');
  }

}
