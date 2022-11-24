import { Migration } from '@mikro-orm/migrations';

export class Migration20221124102636 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event" drop constraint "team_event_used_template_id_foreign";');

    this.addSql('alter table "team_event_registration" drop constraint "team_event_registration_event_id_foreign";');

    this.addSql('alter table "team_gallery" drop constraint "team_gallery_event_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_event_id_foreign";');

    this.addSql('alter table "team_event_validation" drop constraint "team_event_validation_event_id_foreign";');

    this.addSql('alter table "validation_step_users" drop constraint "validation_step_users_validation_step_id_foreign";');

    this.addSql('alter table "team_event_validation" drop constraint "team_event_validation_step_id_foreign";');

    this.addSql('create table "approval_step" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "tenant_id" varchar(255) not null, "step" int not null, "name" varchar(255) not null, "type" text check ("type" in (\'Event\')) not null);');

    this.addSql('create table "event" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "name" varchar(255) not null, "description" text not null, "price" int not null, "created_by_id" varchar(255) not null, "team_id" int not null, "location" text not null, "supervisor_id" int null, "private" boolean not null, "state" text check ("state" in (\'Template\', \'Draft\', \'Submitted\', \'Rejected\', \'Published\')) not null, "last_approval_step_id" int null, "registration_form_id" int null, "used_template_id" int null, "meta" jsonb not null, "event_approval_submission" jsonb not null);');
    this.addSql('create index "event_team_id_index" on "event" ("team_id");');
    this.addSql('create index "event_private_index" on "event" ("private");');
    this.addSql('alter table "event" add constraint "event_registration_form_id_unique" unique ("registration_form_id");');

    this.addSql('create table "event_registration" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "event_id" int not null, "user_id" varchar(255) not null, "status" text check ("status" in (\'Sure\', \'Maybe\', \'Absent\')) not null, "present" boolean not null, "participation_score" int not null, "original_form_id" int null, "form_submission" jsonb null);');

    this.addSql('create table "event_approval" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "event_id" int not null, "user_id" varchar(255) not null, "message" text null, "approved" boolean not null, "step_id" int not null);');

    this.addSql('create table "approval_step_users" ("approval_step_id" int not null, "user_id" varchar(255) not null, constraint "approval_step_users_pkey" primary key ("approval_step_id", "user_id"));');

    this.addSql('alter table "approval_step" add constraint "approval_step_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "event" add constraint "event_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "event" add constraint "event_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "event" add constraint "event_supervisor_id_foreign" foreign key ("supervisor_id") references "team_member" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_last_approval_step_id_foreign" foreign key ("last_approval_step_id") references "team_form" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_registration_form_id_foreign" foreign key ("registration_form_id") references "team_form" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event" add constraint "event_used_template_id_foreign" foreign key ("used_template_id") references "event" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event_registration" add constraint "event_registration_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "event_registration" add constraint "event_registration_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "event_registration" add constraint "event_registration_original_form_id_foreign" foreign key ("original_form_id") references "team_form" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event_approval" add constraint "event_approval_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;');
    this.addSql('alter table "event_approval" add constraint "event_approval_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "event_approval" add constraint "event_approval_step_id_foreign" foreign key ("step_id") references "approval_step" ("id") on update cascade;');

    this.addSql('alter table "approval_step_users" add constraint "approval_step_users_approval_step_id_foreign" foreign key ("approval_step_id") references "approval_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "approval_step_users" add constraint "approval_step_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "team_event" cascade;');

    this.addSql('drop table if exists "team_event_registration" cascade;');

    this.addSql('drop table if exists "validation_step" cascade;');

    this.addSql('drop table if exists "validation_step_users" cascade;');

    this.addSql('drop table if exists "team_event_validation" cascade;');

    this.addSql('alter table "tenant" rename column "event_validation_form" to "event_approval_form";');

    this.addSql('drop index "user_team_event_ical_index";');
    this.addSql('alter table "user" drop constraint "user_team_event_ical_unique";');
    this.addSql('alter table "user" rename column "team_event_ical" to "event_ical";');
    this.addSql('create index "user_event_ical_index" on "user" ("event_ical");');
    this.addSql('alter table "user" add constraint "user_event_ical_unique" unique ("event_ical");');

    this.addSql('alter table "settings" rename column "notification_team_event_created" to "notification_event_created";');
    this.addSql('alter table "settings" rename column "notification_team_event_subscribed_updated" to "notification_event_subscribed_updated";');
    this.addSql('alter table "settings" rename column "notification_team_event_managed_approved" to "notification_event_managed_approved";');
    this.addSql('alter table "settings" rename column "notification_team_event_managed_rejected" to "notification_event_managed_rejected";');
    this.addSql('alter table "settings" rename column "notification_team_event_managed_registration_created" to "notification_event_managed_registration_created";');
    this.addSql('alter table "settings" rename column "notification_admin_team_event_validation_started" to "notification_admin_event_validation_started";');
    this.addSql('alter table "settings" rename column "notification_admin_team_event_validation_step" to "notification_admin_event_validation_step";');
    this.addSql('alter table "settings" rename column "notification_admin_team_event_validation_approved" to "notification_admin_event_validation_approved";');
    this.addSql('alter table "settings" rename column "notification_admin_team_event_validation_rejected" to "notification_admin_event_validation_rejected";');

    this.addSql('alter table "team_gallery" add constraint "team_gallery_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_finance" add constraint "team_finance_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event_approval" drop constraint "event_approval_step_id_foreign";');

    this.addSql('alter table "approval_step_users" drop constraint "approval_step_users_approval_step_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_used_template_id_foreign";');

    this.addSql('alter table "team_gallery" drop constraint "team_gallery_event_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_event_id_foreign";');

    this.addSql('alter table "event_registration" drop constraint "event_registration_event_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_event_id_foreign";');

    this.addSql('create table "team_event" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "name" varchar(255) not null, "description" text not null, "price" int not null, "created_by_id" varchar(255) not null, "team_id" int not null, "location" text not null, "supervisor_id" int null, "private" boolean not null, "state" text check ("state" in (\'Template\', \'Draft\', \'Submitted\', \'Rejected\', \'Published\')) not null, "last_validation_step_id" int null, "registration_form_id" int null, "used_template_id" int null, "meta" jsonb not null, "event_validation_submission" jsonb not null);');
    this.addSql('create index "team_event_team_id_index" on "team_event" ("team_id");');
    this.addSql('create index "team_event_private_index" on "team_event" ("private");');
    this.addSql('alter table "team_event" add constraint "team_event_registration_form_id_unique" unique ("registration_form_id");');

    this.addSql('create table "team_event_registration" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "event_id" int not null, "user_id" varchar(255) not null, "status" text check ("status" in (\'Sure\', \'Maybe\', \'Absent\')) not null, "present" boolean not null, "participation_score" int not null, "original_form_id" int null, "form_submission" jsonb null);');

    this.addSql('create table "validation_step" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "tenant_id" varchar(255) not null, "step" int not null, "name" varchar(255) not null, "type" text check ("type" in (\'TeamEvent\')) not null);');

    this.addSql('create table "validation_step_users" ("validation_step_id" int not null, "user_id" varchar(255) not null, constraint "validation_step_users_pkey" primary key ("validation_step_id", "user_id"));');

    this.addSql('create table "team_event_validation" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "event_id" int not null, "user_id" varchar(255) not null, "message" text null, "approved" boolean not null, "step_id" int not null);');

    this.addSql('alter table "team_event" add constraint "team_event_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "team_event" add constraint "team_event_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_event" add constraint "team_event_supervisor_id_foreign" foreign key ("supervisor_id") references "team_member" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_event" add constraint "team_event_last_validation_step_id_foreign" foreign key ("last_validation_step_id") references "team_form" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_event" add constraint "team_event_registration_form_id_foreign" foreign key ("registration_form_id") references "team_form" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_event" add constraint "team_event_used_template_id_foreign" foreign key ("used_template_id") references "team_event" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_original_form_id_foreign" foreign key ("original_form_id") references "team_form" ("id") on update cascade on delete set null;');

    this.addSql('alter table "validation_step" add constraint "validation_step_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "validation_step_users" add constraint "validation_step_users_validation_step_id_foreign" foreign key ("validation_step_id") references "validation_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "validation_step_users" add constraint "validation_step_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "team_event_validation" add constraint "team_event_validation_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade;');
    this.addSql('alter table "team_event_validation" add constraint "team_event_validation_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "team_event_validation" add constraint "team_event_validation_step_id_foreign" foreign key ("step_id") references "validation_step" ("id") on update cascade;');

    this.addSql('drop table if exists "approval_step" cascade;');

    this.addSql('drop table if exists "event" cascade;');

    this.addSql('drop table if exists "event_registration" cascade;');

    this.addSql('drop table if exists "event_approval" cascade;');

    this.addSql('drop table if exists "approval_step_users" cascade;');

    this.addSql('alter table "tenant" rename column "event_approval_form" to "event_validation_form";');

    this.addSql('drop index "user_event_ical_index";');
    this.addSql('alter table "user" drop constraint "user_event_ical_unique";');
    this.addSql('alter table "user" rename column "event_ical" to "team_event_ical";');
    this.addSql('create index "user_team_event_ical_index" on "user" ("team_event_ical");');
    this.addSql('alter table "user" add constraint "user_team_event_ical_unique" unique ("team_event_ical");');

    this.addSql('alter table "settings" rename column "notification_event_created" to "notification_team_event_created";');
    this.addSql('alter table "settings" rename column "notification_event_subscribed_updated" to "notification_team_event_subscribed_updated";');
    this.addSql('alter table "settings" rename column "notification_event_managed_approved" to "notification_team_event_managed_approved";');
    this.addSql('alter table "settings" rename column "notification_event_managed_rejected" to "notification_team_event_managed_rejected";');
    this.addSql('alter table "settings" rename column "notification_event_managed_registration_created" to "notification_team_event_managed_registration_created";');
    this.addSql('alter table "settings" rename column "notification_admin_event_validation_started" to "notification_admin_team_event_validation_started";');
    this.addSql('alter table "settings" rename column "notification_admin_event_validation_step" to "notification_admin_team_event_validation_step";');
    this.addSql('alter table "settings" rename column "notification_admin_event_validation_approved" to "notification_admin_team_event_validation_approved";');
    this.addSql('alter table "settings" rename column "notification_admin_event_validation_rejected" to "notification_admin_team_event_validation_rejected";');

    this.addSql('alter table "team_gallery" add constraint "team_gallery_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_finance" add constraint "team_finance_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade on delete set null;');
  }

}
