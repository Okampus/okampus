import { Migration } from '@mikro-orm/migrations';

export class Migration20230915135229 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant_role" drop constraint if exists "tenant_role_type_check";');

    this.addSql('alter table "tenant_role" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "tenant_role" add constraint "tenant_role_type_check" check ("type" in (\'Administration\', \'Okampus\', \'Student\', \'Teacher\'));');

    this.addSql('alter table "form" drop column "type";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant_role" drop constraint if exists "tenant_role_type_check";');

    this.addSql('alter table "tenant_role" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "tenant_role" add constraint "tenant_role_type_check" check ("type" in (\'Teacher\', \'Student\', \'Administration\'));');

    this.addSql('alter table "form" add column "type" text check ("type" in (\'EventValidationForm\', \'Event\', \'Team\', \'Survey\')) not null;');
  }

}
