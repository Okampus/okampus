import { Migration } from '@mikro-orm/migrations';

export class Migration20230911080423 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant_role" drop constraint if exists "tenant_role_type_check";');

    this.addSql('alter table "tenant_role" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "tenant_role" add constraint "tenant_role_type_check" check ("type" in (\'Teacher\', \'Student\', \'Administration\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant_role" drop constraint if exists "tenant_role_type_check";');

    this.addSql('alter table "tenant_role" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "tenant_role" add constraint "tenant_role_type_check" check ("type" in (\'President\', \'Treasurer\', \'Secretary\', \'CustomDirectorRole\', \'CustomManagerRole\'));');
  }

}
