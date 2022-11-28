import { Migration } from '@mikro-orm/migrations';

export class Migration20221127220143 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_image" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "last_active_date" timestamptz(0) null, "active" boolean not null, "user_id" varchar(255) not null, "type" text check ("type" in (\'Avatar\', \'Banner\', \'Profile\', \'Other\')) not null, "descriptor" varchar(255) null, constraint "user_image_pkey" primary key ("id"));');
    this.addSql('alter table "user_image" add constraint "user_image_file_id_unique" unique ("file_id");');

    this.addSql('create table "app" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" text null, "owner_id" varchar(255) null, "bot_id" varchar(255) not null);');
    this.addSql('alter table "app" add constraint "app_bot_id_unique" unique ("bot_id");');

    this.addSql('alter table "user_image" add constraint "user_image_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "user_image" add constraint "user_image_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "app" add constraint "app_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "app" add constraint "app_bot_id_foreign" foreign key ("bot_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user" add column "name" text not null, add column "last_name" text null, add column "scope_role" text check ("scope_role" in (\'Student\', \'Teacher\', \'Admin\', \'AdminBot\', \'UserBot\')) not null, add column "avatar_id" varchar(255) null, add column "banner_id" varchar(255) null, add column "status" text null;');
    this.addSql('alter table "user" alter column "email" type text using ("email"::text);');
    this.addSql('alter table "user" alter column "email" drop not null;');
    this.addSql('drop index "user_email_index";');
    this.addSql('drop index "user_event_ical_index";');
    this.addSql('alter table "user" add constraint "user_avatar_id_foreign" foreign key ("avatar_id") references "user_image" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user" add constraint "user_banner_id_foreign" foreign key ("banner_id") references "user_image" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user" drop column "firstname";');
    this.addSql('alter table "user" drop column "lastname";');
    this.addSql('alter table "user" drop column "reputation";');
    this.addSql('alter table "user" drop column "avatar";');
    this.addSql('alter table "user" drop column "school_role";');
    this.addSql('alter table "user" drop column "banner";');
    this.addSql('alter table "user" drop column "short_description";');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('create index "user_bot_index" on "user" ("bot");');
    this.addSql('create index "user_last_name_index" on "user" ("last_name");');

    this.addSql('alter table "file_upload" add column "kind" text check ("kind" in (\'UserImage\', \'TeamImage\', \'TenantImage\', \'Attachment\', \'Tenant\', \'StudyDoc\', \'InfoDoc\', \'TeamFile\', \'TeamGallery\', \'TeamReceipt\')) not null;');
    this.addSql('alter table "file_upload" drop column "validated";');
    this.addSql('alter table "file_upload" drop column "file_kind";');
    this.addSql('alter table "file_upload" drop column "visible";');
    this.addSql('alter table "file_upload" rename column "file_size" to "size";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_avatar_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_banner_id_foreign";');

    this.addSql('drop table if exists "user_image" cascade;');

    this.addSql('drop table if exists "app" cascade;');

    this.addSql('alter table "user" add column "lastname" text not null, add column "reputation" int not null, add column "avatar" text null, add column "school_role" text check ("school_role" in (\'student\', \'teacher\', \'admin\')) not null, add column "banner" text null, add column "short_description" text null;');
    this.addSql('alter table "user" alter column "email" type text using ("email"::text);');
    this.addSql('alter table "user" alter column "email" set not null;');
    this.addSql('alter table "user" drop constraint "user_email_unique";');
    this.addSql('drop index "user_bot_index";');
    this.addSql('drop index "user_last_name_index";');
    this.addSql('alter table "user" drop column "last_name";');
    this.addSql('alter table "user" drop column "scope_role";');
    this.addSql('alter table "user" drop column "avatar_id";');
    this.addSql('alter table "user" drop column "banner_id";');
    this.addSql('alter table "user" drop column "status";');
    this.addSql('alter table "user" rename column "name" to "firstname";');
    this.addSql('create index "user_email_index" on "user" ("email");');
    this.addSql('create index "user_event_ical_index" on "user" ("event_ical");');

    this.addSql('alter table "file_upload" add column "validated" boolean not null, add column "file_kind" text check ("file_kind" in (\'ProfileImage\', \'InfoDoc\', \'Attachment\', \'StudyDoc\', \'TeamFile\', \'TeamGallery\', \'TeamReceipt\', \'Tenant\')) not null, add column "visible" boolean not null;');
    this.addSql('alter table "file_upload" drop column "kind";');
    this.addSql('alter table "file_upload" rename column "size" to "file_size";');
  }

}
