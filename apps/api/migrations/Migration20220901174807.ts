import { Migration } from '@mikro-orm/migrations';

export class Migration20220901174807 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "contact_account" drop constraint "contact_account_contact_id_foreign";');

    this.addSql('create table "social" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "social_type" text check ("social_type" in (\'Discord\', \'Instagram\', \'YouTube\', \'TikTok\', \'Twitch\', \'LinkedIn\')) not null, "link" text not null, "pseudo" text not null, "user_id" varchar(255) null, "team_id" int null);');
    this.addSql('create index "social_user_id_index" on "social" ("user_id");');
    this.addSql('create index "social_team_id_index" on "social" ("team_id");');

    this.addSql('alter table "social" add constraint "social_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "social" add constraint "social_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');

    this.addSql('drop table if exists "contact" cascade;');

    this.addSql('drop table if exists "contact_account" cascade;');

    this.addSql('alter table "team" add column "email" text null;');
    this.addSql('create index "team_name_index" on "team" ("name");');

    this.addSql('alter table "settings" rename column "notification_admin_team_contact_updated" to "notification_admin_team_social_updated";');
  }

  async down(): Promise<void> {
    this.addSql('create table "contact" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "icon" text not null);');

    this.addSql('create table "contact_account" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "kind" text check ("kind" in (\'team\', \'user\')) not null, "contact_id" int not null, "link" text null, "pseudo" text not null, "team_id" int null, "user_id" varchar(255) null);');
    this.addSql('create index "contact_account_kind_index" on "contact_account" ("kind");');
    this.addSql('create index "contact_account_team_id_index" on "contact_account" ("team_id");');
    this.addSql('create index "contact_account_user_id_index" on "contact_account" ("user_id");');

    this.addSql('alter table "contact_account" add constraint "contact_account_contact_id_foreign" foreign key ("contact_id") references "contact" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "contact_account" add constraint "contact_account_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "contact_account" add constraint "contact_account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');

    this.addSql('drop table if exists "social" cascade;');

    this.addSql('drop index "team_name_index";');
    this.addSql('alter table "team" drop column "email";');

    this.addSql('alter table "settings" rename column "notification_admin_team_social_updated" to "notification_admin_team_contact_updated";');
  }

}
