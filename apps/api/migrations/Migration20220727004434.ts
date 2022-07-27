import { Migration } from '@mikro-orm/migrations';

export class Migration20220727004434 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "school_year" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "active" boolean not null);');

    this.addSql('create table "school_group" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "code" varchar(255) not null, "name" varchar(255) not null, "english_name" text null, "parent_id" int null, "description" text null, "active" boolean not null);');
    this.addSql('create index "school_group_code_index" on "school_group" ("code");');
    this.addSql('alter table "school_group" add constraint "school_group_code_unique" unique ("code");');
    this.addSql('create index "school_group_parent_id_index" on "school_group" ("parent_id");');

    this.addSql('create table "school_group_membership" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "active" boolean not null, "school_year_id" int not null, "school_group_id" int not null, "user_id" varchar(255) not null, "role" text check ("role" in (\'representative\', \'substitute\', \'student\')) not null);');
    this.addSql('create index "school_group_membership_active_index" on "school_group_membership" ("active");');
    this.addSql('create index "school_group_membership_school_year_id_index" on "school_group_membership" ("school_year_id");');
    this.addSql('create index "school_group_membership_school_group_id_index" on "school_group_membership" ("school_group_id");');

    this.addSql('alter table "school_group" add constraint "school_group_parent_id_foreign" foreign key ("parent_id") references "school_group" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "school_group_membership" add constraint "school_group_membership_school_year_id_foreign" foreign key ("school_year_id") references "school_year" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "school_group_membership" add constraint "school_group_membership_school_group_id_foreign" foreign key ("school_group_id") references "school_group" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "school_group_membership" add constraint "school_group_membership_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team" drop constraint if exists "team_kind_check";');

    this.addSql('alter table "content" add column "is_anonymous" boolean not null;');

    this.addSql('alter table "team" alter column "kind" type text using ("kind"::text);');
    this.addSql('alter table "team" add constraint "team_kind_check" check ("kind" in (\'department\', \'club\'));');

    this.addSql('alter table "subject" add column "school_group_id" int null, add column "active" boolean not null;');
    this.addSql('alter table "subject" add constraint "subject_school_group_id_foreign" foreign key ("school_group_id") references "school_group" ("id") on update cascade on delete set null;');
    this.addSql('alter table "subject" drop column "school_year";');

    this.addSql('alter table "study_doc" drop column "cursus";');

    this.addSql('alter table "info_doc" add column "school_group_id" int null;');
    this.addSql('alter table "info_doc" add constraint "info_doc_school_group_id_foreign" foreign key ("school_group_id") references "school_group" ("id") on update cascade on delete set null;');
    this.addSql('alter table "info_doc" drop column "school_year";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "school_group_membership" drop constraint "school_group_membership_school_year_id_foreign";');

    this.addSql('alter table "school_group" drop constraint "school_group_parent_id_foreign";');

    this.addSql('alter table "subject" drop constraint "subject_school_group_id_foreign";');

    this.addSql('alter table "info_doc" drop constraint "info_doc_school_group_id_foreign";');

    this.addSql('alter table "school_group_membership" drop constraint "school_group_membership_school_group_id_foreign";');

    this.addSql('drop table if exists "school_year" cascade;');

    this.addSql('drop table if exists "school_group" cascade;');

    this.addSql('drop table if exists "school_group_membership" cascade;');

    this.addSql('alter table "team" drop constraint if exists "team_kind_check";');

    this.addSql('alter table "content" drop column "is_anonymous";');

    this.addSql('alter table "info_doc" add column "school_year" smallint null;');
    this.addSql('alter table "info_doc" drop column "school_group_id";');

    this.addSql('alter table "team" alter column "kind" type text using ("kind"::text);');
    this.addSql('alter table "team" add constraint "team_kind_check" check ("kind" in (\'team\', \'club\'));');

    this.addSql('alter table "subject" add column "school_year" smallint not null;');
    this.addSql('alter table "subject" drop column "school_group_id";');
    this.addSql('alter table "subject" drop column "active";');

    this.addSql('alter table "study_doc" add column "cursus" text check ("cursus" in (\'all\', \'classic\', \'int\', \'pex\', \'renforced\')) not null;');
  }

}
