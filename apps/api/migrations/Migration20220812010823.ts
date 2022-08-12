import { Migration } from '@mikro-orm/migrations';

export class Migration20220812010823 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant" drop constraint "tenant_logo_id_foreign";');
    this.addSql('alter table "tenant" drop constraint "tenant_logo_dark_id_foreign";');

    this.addSql('alter table "tenant" add column "logo" text null, add column "logo_dark" text null;');
    this.addSql('alter table "tenant" drop constraint "tenant_logo_id_unique";');
    this.addSql('alter table "tenant" drop constraint "tenant_logo_dark_id_unique";');
    this.addSql('alter table "tenant" drop column "logo_id";');
    this.addSql('alter table "tenant" drop column "logo_dark_id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant" add column "logo_id" varchar(255) null, add column "logo_dark_id" varchar(255) null;');
    this.addSql('alter table "tenant" add constraint "tenant_logo_id_foreign" foreign key ("logo_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "tenant" add constraint "tenant_logo_dark_id_foreign" foreign key ("logo_dark_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "tenant" drop column "logo";');
    this.addSql('alter table "tenant" drop column "logo_dark";');
    this.addSql('alter table "tenant" add constraint "tenant_logo_id_unique" unique ("logo_id");');
    this.addSql('alter table "tenant" add constraint "tenant_logo_dark_id_unique" unique ("logo_dark_id");');
  }

}
