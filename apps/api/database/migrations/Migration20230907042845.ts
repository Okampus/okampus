import { Migration } from '@mikro-orm/migrations';

export class Migration20230907042845 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant_role" add column "can_manage_tenant" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant_role" drop column "can_manage_tenant";');
  }

}
