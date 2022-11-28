import { Migration } from '@mikro-orm/migrations';

export class Migration20221128030856 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team_image" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "last_active_date" timestamptz(0) null, "active" boolean not null, "team_id" int not null, "type" text check ("type" in (\'Logo\', \'LogoDark\', \'Banner\', \'Profile\', \'Sticker\', \'Other\')) not null, "descriptor" varchar(255) null, constraint "team_image_pkey" primary key ("id"));');
    this.addSql('alter table "team_image" add constraint "team_image_file_id_unique" unique ("file_id");');

    this.addSql('alter table "team_image" add constraint "team_image_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_image" add constraint "team_image_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "label" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "label" add constraint "label_type_check" check ("type" in (\'Category\', \'Descriptor\', \'Meta\'));');

    this.addSql('alter table "team" add column "logo_dark_id" varchar(255) null, add column "banner_id" varchar(255) null;');
    this.addSql('alter table "team" add constraint "team_logo_dark_id_foreign" foreign key ("logo_dark_id") references "team_image" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team" add constraint "team_banner_id_foreign" foreign key ("banner_id") references "team_image" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team" drop column "avatar";');
    this.addSql('alter table "team" drop column "banner";');
    this.addSql('alter table "team" rename column "location" to "logo_id";');
    this.addSql('alter table "team" add constraint "team_logo_id_foreign" foreign key ("logo_id") references "team_image" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team" drop constraint "team_logo_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_logo_dark_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_banner_id_foreign";');

    this.addSql('drop table if exists "team_image" cascade;');

    this.addSql('alter table "label" drop constraint if exists "label_type_check";');

    this.addSql('alter table "label" alter column "type" type varchar(255) using ("type"::varchar(255));');

    this.addSql('alter table "team" add column "location" varchar(255) null, add column "avatar" text null, add column "banner" text null;');
    this.addSql('alter table "team" drop column "logo_id";');
    this.addSql('alter table "team" drop column "logo_dark_id";');
    this.addSql('alter table "team" drop column "banner_id";');
  }

}
