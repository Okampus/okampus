import { Migration } from '@mikro-orm/migrations';

export class Migration20230823232554 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant" add constraint "tenant_oidc_name_unique" unique ("oidc_name");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant" drop constraint "tenant_oidc_name_unique";');
  }

}
