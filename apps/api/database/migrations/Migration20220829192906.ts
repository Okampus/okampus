import { Migration } from '@mikro-orm/migrations';

export class Migration20220829192906 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant" add column "tenant_oidc_name" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant" drop column "tenant_oidc_name";');
  }

}
