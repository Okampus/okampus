import { Migration } from '@mikro-orm/migrations';

export class Migration20220813031115 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_file" drop constraint if exists "team_file_type_check";');

    this.addSql('alter table "file_upload" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "file_upload" add constraint "file_upload_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "profile_image" add column "last_active_date" timestamptz(0) null;');

    this.addSql('alter table "team_file" add column "last_active_date" timestamptz(0) null, add column "active" boolean not null;');
    this.addSql('alter table "team_file" alter column "type" type text using ("type"::text);');

    this.addSql('alter table "study_doc" add column "last_active_date" timestamptz(0) null, add column "active" boolean not null;');

    this.addSql('alter table "info_doc" add column "last_active_date" timestamptz(0) null, add column "active" boolean not null;');

    this.addSql('alter table "attachment" add column "last_active_date" timestamptz(0) null, add column "active" boolean not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "file_upload" drop constraint "file_upload_tenant_id_foreign";');

    this.addSql('alter table "file_upload" drop column "tenant_id";');

    this.addSql('alter table "profile_image" drop column "last_active_date";');

    this.addSql('alter table "team_file" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_file" add constraint "team_file_type_check" check ("type" in (\'document\', \'gallery\', \'receipt\'));');
    this.addSql('alter table "team_file" drop column "last_active_date";');
    this.addSql('alter table "team_file" drop column "active";');

    this.addSql('alter table "study_doc" drop column "last_active_date";');
    this.addSql('alter table "study_doc" drop column "active";');

    this.addSql('alter table "info_doc" drop column "last_active_date";');
    this.addSql('alter table "info_doc" drop column "active";');

    this.addSql('alter table "attachment" drop column "last_active_date";');
    this.addSql('alter table "attachment" drop column "active";');
  }

}
