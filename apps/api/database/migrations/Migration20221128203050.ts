import { Migration } from '@mikro-orm/migrations';

export class Migration20221128203050 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "tenant_image" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "tenant_id" varchar(255) not null, "type" text check ("type" in (\'Logo\', \'LogoDark\', \'Profile\', \'Other\')) not null, "descriptor" varchar(255) null, "file_id" varchar(255) not null, "last_active_date" timestamptz(0) null, "active" boolean not null, constraint "tenant_image_pkey" primary key ("id"));');
    this.addSql('alter table "tenant_image" add constraint "tenant_image_file_id_unique" unique ("file_id");');

    this.addSql('alter table "tenant_image" add constraint "tenant_image_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "tenant_image" add constraint "tenant_image_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');

    this.addSql('drop table if exists "profile_image" cascade;');

    this.addSql('alter table "file_upload" drop constraint "file_upload_tenant_id_foreign";');

    this.addSql('alter table "user_image" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "user_image" add constraint "user_image_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "file_upload" drop column "tenant_id";');

    this.addSql('alter table "tenant" add column "logo_id" varchar(255) null, add column "logo_dark_id" varchar(255) null;');
    this.addSql('alter table "tenant" add constraint "tenant_logo_id_foreign" foreign key ("logo_id") references "tenant_image" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "tenant" add constraint "tenant_logo_dark_id_foreign" foreign key ("logo_dark_id") references "tenant_image" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "tenant" drop column "logo";');
    this.addSql('alter table "tenant" drop column "logo_dark";');

    this.addSql('alter table "team_receipt" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "team_image" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "team_image" add constraint "team_image_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "team_file" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "team_file" add constraint "team_file_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "study_doc" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "study_doc" add constraint "study_doc_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "info_doc" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "info_doc" add constraint "info_doc_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "team_gallery" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "team_gallery" add constraint "team_gallery_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "attachment" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "attachment" add constraint "attachment_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant" drop constraint "tenant_logo_id_foreign";');

    this.addSql('alter table "tenant" drop constraint "tenant_logo_dark_id_foreign";');

    this.addSql('create table "profile_image" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "last_active_date" timestamptz(0) null, "active" boolean not null, "user_id" varchar(255) null, "team_id" int null, "tenant_id" varchar(255) null, "type" varchar(255) not null, constraint "profile_image_pkey" primary key ("id"));');
    this.addSql('alter table "profile_image" add constraint "profile_image_file_id_unique" unique ("file_id");');

    this.addSql('alter table "profile_image" add constraint "profile_image_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "profile_image" add constraint "profile_image_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "profile_image" add constraint "profile_image_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "profile_image" add constraint "profile_image_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade on delete CASCADE;');

    this.addSql('drop table if exists "tenant_image" cascade;');

    this.addSql('alter table "user_image" drop constraint "user_image_tenant_id_foreign";');

    this.addSql('alter table "team_receipt" drop constraint "team_receipt_tenant_id_foreign";');

    this.addSql('alter table "team_image" drop constraint "team_image_tenant_id_foreign";');

    this.addSql('alter table "team_file" drop constraint "team_file_tenant_id_foreign";');

    this.addSql('alter table "study_doc" drop constraint "study_doc_tenant_id_foreign";');

    this.addSql('alter table "info_doc" drop constraint "info_doc_tenant_id_foreign";');

    this.addSql('alter table "team_gallery" drop constraint "team_gallery_tenant_id_foreign";');

    this.addSql('alter table "attachment" drop constraint "attachment_tenant_id_foreign";');

    this.addSql('alter table "tenant" add column "logo" text null, add column "logo_dark" text null;');
    this.addSql('alter table "tenant" drop column "logo_id";');
    this.addSql('alter table "tenant" drop column "logo_dark_id";');

    this.addSql('alter table "user_image" drop column "tenant_id";');

    this.addSql('alter table "file_upload" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "file_upload" add constraint "file_upload_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "team_receipt" drop column "tenant_id";');

    this.addSql('alter table "team_image" drop column "tenant_id";');

    this.addSql('alter table "team_file" drop column "tenant_id";');

    this.addSql('alter table "study_doc" drop column "tenant_id";');

    this.addSql('alter table "info_doc" drop column "tenant_id";');

    this.addSql('alter table "team_gallery" drop column "tenant_id";');

    this.addSql('alter table "attachment" drop column "tenant_id";');
  }

}
