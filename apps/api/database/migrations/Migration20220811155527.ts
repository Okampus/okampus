import { Migration } from '@mikro-orm/migrations';

export class Migration20220811155527 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant" add column "logo_dark_id" varchar(255) null;');
    this.addSql('alter table "tenant" add constraint "tenant_logo_dark_id_foreign" foreign key ("logo_dark_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "tenant" add constraint "tenant_logo_dark_id_unique" unique ("logo_dark_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant" drop constraint "tenant_logo_dark_id_foreign";');

    this.addSql('alter table "tenant" drop constraint "tenant_logo_dark_id_unique";');
    this.addSql('alter table "tenant" drop column "logo_dark_id";');
  }

}
