import { Migration } from '@mikro-orm/migrations';

export class Migration20221122192306 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "daily_menu_starters" drop constraint "daily_menu_starters_daily_menu_id_foreign";');

    this.addSql('alter table "daily_menu_dishes" drop constraint "daily_menu_dishes_daily_menu_id_foreign";');

    this.addSql('alter table "daily_menu_desserts" drop constraint "daily_menu_desserts_daily_menu_id_foreign";');

    this.addSql('alter table "school_group" drop constraint "school_group_parent_id_foreign";');

    this.addSql('alter table "subject" drop constraint "subject_school_group_id_foreign";');

    this.addSql('alter table "school_group_membership" drop constraint "school_group_membership_school_group_id_foreign";');

    this.addSql('alter table "info_doc" drop constraint "info_doc_school_group_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_scope_id_foreign";');

    this.addSql('alter table "team_labels" drop constraint "team_labels_team_label_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_last_edit_id_foreign";');

    this.addSql('create table "class" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "english_name" text null, "type" text check ("type" in (\'Everyone\', \'Program\', \'Year\', \'Sector\', \'Class\')) not null, "parent_id" varchar(255) null, "description" text null, "active" boolean not null, constraint "class_pkey" primary key ("id"));');
    this.addSql('create index "class_parent_id_index" on "class" ("parent_id");');

    this.addSql('create table "label" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "tooltip" varchar(255) null, "image" text null, "type" varchar(255) not null, constraint "label_pkey" primary key ("id"));');

    this.addSql('create table "menu" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "date" timestamptz(0) not null);');
    this.addSql('create index "menu_date_index" on "menu" ("date");');
    this.addSql('alter table "menu" add constraint "menu_date_unique" unique ("date");');

    this.addSql('create table "menu_desserts" ("menu_id" int not null, "food_id" int not null, constraint "menu_desserts_pkey" primary key ("menu_id", "food_id"));');

    this.addSql('create table "menu_dishes" ("menu_id" int not null, "food_id" int not null, constraint "menu_dishes_pkey" primary key ("menu_id", "food_id"));');

    this.addSql('create table "menu_starters" ("menu_id" int not null, "food_id" int not null, constraint "menu_starters_pkey" primary key ("menu_id", "food_id"));');

    this.addSql('create table "class_membership" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "school_year_id" varchar(255) not null, "school_group_id" varchar(255) not null, "role" text check ("role" in (\'Representative\', \'Substitute\', \'Student\')) not null, "active" boolean not null);');
    this.addSql('create index "class_membership_school_year_id_index" on "class_membership" ("school_year_id");');
    this.addSql('create index "class_membership_school_group_id_index" on "class_membership" ("school_group_id");');
    this.addSql('create index "class_membership_active_index" on "class_membership" ("active");');

    this.addSql('create table "edit" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" text not null, "edit_order" int not null, "parent_id" int not null, "edited_by_id" varchar(255) not null);');

    this.addSql('create table "wiki" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null, "body" text not null, "category" text not null, "hidden" boolean not null);');

    this.addSql('alter table "class" add constraint "class_parent_id_foreign" foreign key ("parent_id") references "class" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "menu_desserts" add constraint "menu_desserts_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "menu_desserts" add constraint "menu_desserts_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "menu_dishes" add constraint "menu_dishes_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "menu_dishes" add constraint "menu_dishes_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "menu_starters" add constraint "menu_starters_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "menu_starters" add constraint "menu_starters_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "class_membership" add constraint "class_membership_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "class_membership" add constraint "class_membership_school_year_id_foreign" foreign key ("school_year_id") references "school_year" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "class_membership" add constraint "class_membership_school_group_id_foreign" foreign key ("school_group_id") references "class" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "edit" add constraint "edit_parent_id_foreign" foreign key ("parent_id") references "content" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "edit" add constraint "edit_edited_by_id_foreign" foreign key ("edited_by_id") references "user" ("id") on update cascade on delete CASCADE;');

    this.addSql('drop table if exists "daily_info" cascade;');

    this.addSql('drop table if exists "daily_menu" cascade;');

    this.addSql('drop table if exists "daily_menu_starters" cascade;');

    this.addSql('drop table if exists "daily_menu_dishes" cascade;');

    this.addSql('drop table if exists "daily_menu_desserts" cascade;');

    this.addSql('drop table if exists "school_group" cascade;');

    this.addSql('drop table if exists "team_label" cascade;');

    this.addSql('drop table if exists "school_group_membership" cascade;');

    this.addSql('drop table if exists "content_edit" cascade;');

    this.addSql('drop table if exists "wiki_page" cascade;');

    this.addSql('alter table "team" drop constraint "team_membership_request_form_id_foreign";');

    this.addSql('alter table "team_membership_request" drop constraint "team_membership_request_original_form_id_foreign";');

    this.addSql('alter table "team_event" drop constraint "team_event_last_validation_step_id_foreign";');

    this.addSql('alter table "team_gallery" drop constraint "team_gallery_event_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_receipt_id_foreign";');

    this.addSql('alter table "subject" alter column "school_group_id" type varchar(255) using ("school_group_id"::varchar(255));');
    this.addSql('alter table "subject" alter column "school_group_id" set not null;');
    this.addSql('alter table "subject" add constraint "subject_school_group_id_foreign" foreign key ("school_group_id") references "class" ("id") on update cascade;');

    this.addSql('alter table "team" alter column "membership_request_form_id" type int using ("membership_request_form_id"::int);');
    this.addSql('alter table "team" alter column "membership_request_form_id" set not null;');
    this.addSql('alter table "team" add constraint "team_membership_request_form_id_foreign" foreign key ("membership_request_form_id") references "team_form" ("id") on update cascade;');

    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_original_form_id_foreign" foreign key ("original_form_id") references "team_form" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_labels" drop constraint "team_labels_pkey";');
    this.addSql('alter table "team_labels" rename column "team_label_id" to "label_id";');
    this.addSql('alter table "team_labels" add constraint "team_labels_label_id_foreign" foreign key ("label_id") references "label" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_labels" add constraint "team_labels_pkey" primary key ("team_id", "label_id");');

    this.addSql('alter table "team_event" add constraint "team_event_last_validation_step_id_foreign" foreign key ("last_validation_step_id") references "team_form" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_gallery" add constraint "team_gallery_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_finance" alter column "receipt_id" type varchar(255) using ("receipt_id"::varchar(255));');
    this.addSql('alter table "team_finance" alter column "receipt_id" set not null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_receipt_id_foreign" foreign key ("receipt_id") references "team_file" ("id") on update cascade;');

    this.addSql('alter table "info_doc" alter column "school_group_id" type varchar(255) using ("school_group_id"::varchar(255));');
    this.addSql('alter table "info_doc" alter column "school_group_id" set not null;');
    this.addSql('alter table "info_doc" add constraint "info_doc_school_group_id_foreign" foreign key ("school_group_id") references "class" ("id") on update cascade;');

    this.addSql('alter table "content" add constraint "content_last_edit_id_foreign" foreign key ("last_edit_id") references "edit" ("id") on update cascade on delete set null;');

    this.addSql('alter table "content_master" add constraint "content_master_scope_id_foreign" foreign key ("scope_id") references "class" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "class" drop constraint "class_parent_id_foreign";');

    this.addSql('alter table "subject" drop constraint "subject_school_group_id_foreign";');

    this.addSql('alter table "info_doc" drop constraint "info_doc_school_group_id_foreign";');

    this.addSql('alter table "class_membership" drop constraint "class_membership_school_group_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_scope_id_foreign";');

    this.addSql('alter table "team_labels" drop constraint "team_labels_label_id_foreign";');

    this.addSql('alter table "menu_desserts" drop constraint "menu_desserts_menu_id_foreign";');

    this.addSql('alter table "menu_dishes" drop constraint "menu_dishes_menu_id_foreign";');

    this.addSql('alter table "menu_starters" drop constraint "menu_starters_menu_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_last_edit_id_foreign";');

    this.addSql('create table "daily_info" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "date" timestamptz(0) not null, "content" text not null);');
    this.addSql('create index "daily_info_date_index" on "daily_info" ("date");');
    this.addSql('alter table "daily_info" add constraint "daily_info_date_unique" unique ("date");');

    this.addSql('create table "daily_menu" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "date" timestamptz(0) not null);');
    this.addSql('create index "daily_menu_date_index" on "daily_menu" ("date");');
    this.addSql('alter table "daily_menu" add constraint "daily_menu_date_unique" unique ("date");');

    this.addSql('create table "daily_menu_starters" ("daily_menu_id" int not null, "food_id" int not null, constraint "daily_menu_starters_pkey" primary key ("daily_menu_id", "food_id"));');

    this.addSql('create table "daily_menu_dishes" ("daily_menu_id" int not null, "food_id" int not null, constraint "daily_menu_dishes_pkey" primary key ("daily_menu_id", "food_id"));');

    this.addSql('create table "daily_menu_desserts" ("daily_menu_id" int not null, "food_id" int not null, constraint "daily_menu_desserts_pkey" primary key ("daily_menu_id", "food_id"));');

    this.addSql('create table "school_group" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "english_name" text null, "type" text check ("type" in (\'Everyone\', \'Program\', \'Year\', \'Sector\', \'Class\')) not null, "parent_id" varchar(255) null, "description" text null, "active" boolean not null, constraint "school_group_pkey" primary key ("id"));');
    this.addSql('create index "school_group_parent_id_index" on "school_group" ("parent_id");');

    this.addSql('create table "team_label" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "tooltip" varchar(255) null, "image" text null, "type" varchar(255) not null, constraint "team_label_pkey" primary key ("id"));');

    this.addSql('create table "school_group_membership" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "school_year_id" varchar(255) not null, "school_group_id" varchar(255) not null, "role" text check ("role" in (\'Representative\', \'Substitute\', \'Student\')) not null, "active" boolean not null);');
    this.addSql('create index "school_group_membership_school_year_id_index" on "school_group_membership" ("school_year_id");');
    this.addSql('create index "school_group_membership_school_group_id_index" on "school_group_membership" ("school_group_id");');
    this.addSql('create index "school_group_membership_active_index" on "school_group_membership" ("active");');

    this.addSql('create table "content_edit" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" text not null, "edit_order" int not null, "parent_id" int not null, "edited_by_id" varchar(255) not null);');

    this.addSql('create table "wiki_page" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null, "body" text not null, "category" text not null, "hidden" boolean not null);');

    this.addSql('alter table "daily_menu_starters" add constraint "daily_menu_starters_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_starters" add constraint "daily_menu_starters_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "daily_menu_dishes" add constraint "daily_menu_dishes_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_dishes" add constraint "daily_menu_dishes_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "daily_menu_desserts" add constraint "daily_menu_desserts_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_desserts" add constraint "daily_menu_desserts_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "school_group" add constraint "school_group_parent_id_foreign" foreign key ("parent_id") references "school_group" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "school_group_membership" add constraint "school_group_membership_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "school_group_membership" add constraint "school_group_membership_school_year_id_foreign" foreign key ("school_year_id") references "school_year" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "school_group_membership" add constraint "school_group_membership_school_group_id_foreign" foreign key ("school_group_id") references "school_group" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "content_edit" add constraint "content_edit_parent_id_foreign" foreign key ("parent_id") references "content" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content_edit" add constraint "content_edit_edited_by_id_foreign" foreign key ("edited_by_id") references "user" ("id") on update cascade on delete CASCADE;');

    this.addSql('drop table if exists "class" cascade;');

    this.addSql('drop table if exists "label" cascade;');

    this.addSql('drop table if exists "menu" cascade;');

    this.addSql('drop table if exists "menu_desserts" cascade;');

    this.addSql('drop table if exists "menu_dishes" cascade;');

    this.addSql('drop table if exists "menu_starters" cascade;');

    this.addSql('drop table if exists "class_membership" cascade;');

    this.addSql('drop table if exists "edit" cascade;');

    this.addSql('drop table if exists "wiki" cascade;');

    this.addSql('alter table "team" drop constraint "team_membership_request_form_id_foreign";');

    this.addSql('alter table "team_membership_request" drop constraint "team_membership_request_original_form_id_foreign";');

    this.addSql('alter table "team_event" drop constraint "team_event_last_validation_step_id_foreign";');

    this.addSql('alter table "team_gallery" drop constraint "team_gallery_event_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_receipt_id_foreign";');

    this.addSql('alter table "subject" alter column "school_group_id" type varchar(255) using ("school_group_id"::varchar(255));');
    this.addSql('alter table "subject" alter column "school_group_id" drop not null;');
    this.addSql('alter table "subject" add constraint "subject_school_group_id_foreign" foreign key ("school_group_id") references "school_group" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team" alter column "membership_request_form_id" type int using ("membership_request_form_id"::int);');
    this.addSql('alter table "team" alter column "membership_request_form_id" drop not null;');
    this.addSql('alter table "team" add constraint "team_membership_request_form_id_foreign" foreign key ("membership_request_form_id") references "team_form" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_original_form_id_foreign" foreign key ("original_form_id") references "team_form" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_labels" drop constraint "team_labels_pkey";');
    this.addSql('alter table "team_labels" rename column "label_id" to "team_label_id";');
    this.addSql('alter table "team_labels" add constraint "team_labels_team_label_id_foreign" foreign key ("team_label_id") references "team_label" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_labels" add constraint "team_labels_pkey" primary key ("team_id", "team_label_id");');

    this.addSql('alter table "info_doc" alter column "school_group_id" type varchar(255) using ("school_group_id"::varchar(255));');
    this.addSql('alter table "info_doc" alter column "school_group_id" drop not null;');
    this.addSql('alter table "info_doc" add constraint "info_doc_school_group_id_foreign" foreign key ("school_group_id") references "school_group" ("id") on update cascade on delete set null;');

    this.addSql('alter table "content" add constraint "content_last_edit_id_foreign" foreign key ("last_edit_id") references "content_edit" ("id") on update cascade on delete set null;');

    this.addSql('alter table "content_master" add constraint "content_master_scope_id_foreign" foreign key ("scope_id") references "school_group" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_event" add constraint "team_event_last_validation_step_id_foreign" foreign key ("last_validation_step_id") references "validation_step" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_gallery" add constraint "team_gallery_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_finance" alter column "receipt_id" type varchar(255) using ("receipt_id"::varchar(255));');
    this.addSql('alter table "team_finance" alter column "receipt_id" drop not null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_receipt_id_foreign" foreign key ("receipt_id") references "team_file" ("id") on update cascade on delete set null;');
  }

}
