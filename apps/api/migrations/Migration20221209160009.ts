import { Migration } from '@mikro-orm/migrations';

export class Migration20221209160009 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_tenant_id_foreign";');

    this.addSql('alter table "user_image" drop constraint "user_image_tenant_id_foreign";');

    this.addSql('alter table "tenant_image" drop constraint "tenant_image_tenant_id_foreign";');

    this.addSql('alter table "approval_step" drop constraint "approval_step_tenant_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_tenant_id_foreign";');

    this.addSql('alter table "team_receipt" drop constraint "team_receipt_tenant_id_foreign";');
    this.addSql('alter table "team_receipt" drop constraint "team_receipt_team_id_foreign";');

    this.addSql('alter table "team_member" drop constraint "team_member_team_id_foreign";');

    this.addSql('alter table "team_image" drop constraint "team_image_tenant_id_foreign";');
    this.addSql('alter table "team_image" drop constraint "team_image_team_id_foreign";');

    this.addSql('alter table "team_history" drop constraint "team_history_parent_id_foreign";');
    this.addSql('alter table "team_history" drop constraint "team_history_team_id_foreign";');

    this.addSql('alter table "team_form" drop constraint "team_form_team_id_foreign";');

    this.addSql('alter table "team_membership_request" drop constraint "team_membership_request_team_id_foreign";');

    this.addSql('alter table "team_labels" drop constraint "team_labels_team_id_foreign";');

    this.addSql('alter table "social" drop constraint "social_team_id_foreign";');

    this.addSql('alter table "interest" drop constraint "interest_team_id_foreign";');

    this.addSql('alter table "team_file" drop constraint "team_file_tenant_id_foreign";');
    this.addSql('alter table "team_file" drop constraint "team_file_team_id_foreign";');

    this.addSql('alter table "study_doc" drop constraint "study_doc_tenant_id_foreign";');

    this.addSql('alter table "info_doc" drop constraint "info_doc_tenant_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_team_id_foreign";');

    this.addSql('alter table "team_gallery" drop constraint "team_gallery_tenant_id_foreign";');
    this.addSql('alter table "team_gallery" drop constraint "team_gallery_team_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_team_id_foreign";');

    this.addSql('alter table "content_master_assigned_teams" drop constraint "content_master_assigned_teams_team_id_foreign";');

    this.addSql('alter table "attachment" drop constraint "attachment_tenant_id_foreign";');

    this.addSql('alter table "user" alter column "bot" type boolean using ("bot"::boolean);');
    this.addSql('alter table "user" alter column "bot" set default false;');
    this.addSql('alter table "user" alter column "points" type int using ("points"::int);');
    this.addSql('alter table "user" alter column "points" set default 0;');
    this.addSql('alter table "user" rename column "tenant_id" to "tenant_slug";');
    this.addSql('alter table "tenant" rename column "id" to "slug";');
    this.addSql('alter table "user" add constraint "user_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');

    this.addSql('alter table "user_image" rename column "tenant_id" to "tenant_slug";');
    this.addSql('alter table "user_image" add constraint "user_image_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');

    this.addSql('alter table "tenant_image" rename column "tenant_id" to "tenant_slug";');
    this.addSql('alter table "tenant_image" add constraint "tenant_image_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade on delete CASCADE;');

    this.addSql('alter table "approval_step" rename column "tenant_id" to "tenant_slug";');
    this.addSql('alter table "approval_step" add constraint "approval_step_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');

    this.addSql('alter table "team" add column "tenant_slug" varchar(255) not null;');
    this.addSql('alter table "team" alter column "id" type int using ("id"::int);');
    this.addSql('alter table "team" drop constraint "team_pkey";');
    this.addSql('alter table "team" add constraint "team_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');
    this.addSql('alter table "team" alter column "id" drop default;');
    this.addSql('alter table "team" rename column "tenant_id" to "slug";');
    this.addSql('alter table "team" add constraint "team_pkey" primary key ("id", "slug");');

    this.addSql('alter table "team_receipt" add column "team_slug" varchar(255) not null;');
    this.addSql('alter table "team_receipt" rename column "tenant_id" to "tenant_slug";');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade;');

    this.addSql('alter table "team_member" add column "team_slug" varchar(255) not null;');
    this.addSql('drop index "team_member_team_id_index";');
    this.addSql('alter table "team_member" add constraint "team_member_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade on delete CASCADE;');
    this.addSql('create index "team_member_team_id_team_slug_index" on "team_member" ("team_id", "team_slug");');

    this.addSql('alter table "team_image" add column "team_slug" varchar(255) not null;');
    this.addSql('alter table "team_image" rename column "tenant_id" to "tenant_slug";');
    this.addSql('alter table "team_image" add constraint "team_image_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');
    this.addSql('alter table "team_image" add constraint "team_image_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_history" add column "parent_slug" varchar(255) null, add column "team_slug" varchar(255) not null;');
    this.addSql('alter table "team_history" add constraint "team_history_parent_id_parent_slug_foreign" foreign key ("parent_id", "parent_slug") references "team" ("id", "slug") on update cascade on delete set null;');
    this.addSql('alter table "team_history" add constraint "team_history_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade;');

    this.addSql('alter table "team_form" add column "team_slug" varchar(255) not null;');
    this.addSql('drop index "team_form_team_id_index";');
    this.addSql('alter table "team_form" add constraint "team_form_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade on delete CASCADE;');
    this.addSql('create index "team_form_team_id_team_slug_index" on "team_form" ("team_id", "team_slug");');

    this.addSql('alter table "team_membership_request" add column "team_slug" varchar(255) not null;');
    this.addSql('drop index "team_membership_request_team_id_index";');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade on delete CASCADE;');
    this.addSql('create index "team_membership_request_team_id_team_slug_index" on "team_membership_request" ("team_id", "team_slug");');

    this.addSql('alter table "team_labels" add column "team_slug" varchar(255) not null;');
    this.addSql('alter table "team_labels" drop constraint "team_labels_pkey";');
    this.addSql('alter table "team_labels" add constraint "team_labels_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade on delete cascade;');
    this.addSql('alter table "team_labels" add constraint "team_labels_pkey" primary key ("team_id", "team_slug", "label_id");');

    this.addSql('alter table "social" add column "team_slug" varchar(255) null;');
    this.addSql('drop index "social_team_id_index";');
    this.addSql('alter table "social" add constraint "social_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade on delete CASCADE;');
    this.addSql('create index "social_team_id_team_slug_index" on "social" ("team_id", "team_slug");');

    this.addSql('alter table "interest" add column "team_slug" varchar(255) not null;');
    this.addSql('alter table "interest" drop constraint "interest_team_id_user_id_unique";');
    this.addSql('alter table "interest" add constraint "interest_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade;');
    this.addSql('alter table "interest" add constraint "interest_team_id_team_slug_user_id_unique" unique ("team_id", "team_slug", "user_id");');

    this.addSql('alter table "team_file" add column "team_slug" varchar(255) not null;');
    this.addSql('alter table "team_file" rename column "tenant_id" to "tenant_slug";');
    this.addSql('alter table "team_file" add constraint "team_file_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');
    this.addSql('alter table "team_file" add constraint "team_file_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade;');

    this.addSql('alter table "study_doc" rename column "tenant_id" to "tenant_slug";');
    this.addSql('alter table "study_doc" add constraint "study_doc_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');

    this.addSql('alter table "info_doc" rename column "tenant_id" to "tenant_slug";');
    this.addSql('alter table "info_doc" add constraint "info_doc_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');

    this.addSql('alter table "event" add column "team_slug" varchar(255) not null;');
    this.addSql('drop index "event_team_id_index";');
    this.addSql('alter table "event" add constraint "event_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade on delete CASCADE;');
    this.addSql('create index "event_team_id_team_slug_index" on "event" ("team_id", "team_slug");');

    this.addSql('alter table "team_gallery" add column "team_slug" varchar(255) not null;');
    this.addSql('alter table "team_gallery" rename column "tenant_id" to "tenant_slug";');
    this.addSql('alter table "team_gallery" add constraint "team_gallery_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');
    this.addSql('alter table "team_gallery" add constraint "team_gallery_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade;');

    this.addSql('alter table "team_finance" add column "team_slug" varchar(255) not null;');
    this.addSql('drop index "team_finance_team_id_index";');
    this.addSql('alter table "team_finance" add constraint "team_finance_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade on delete CASCADE;');
    this.addSql('create index "team_finance_team_id_team_slug_index" on "team_finance" ("team_id", "team_slug");');

    this.addSql('alter table "content_master_assigned_teams" add column "team_slug" varchar(255) not null;');
    this.addSql('alter table "content_master_assigned_teams" drop constraint "content_master_assigned_teams_pkey";');
    this.addSql('alter table "content_master_assigned_teams" add constraint "content_master_assigned_teams_team_id_team_slug_foreign" foreign key ("team_id", "team_slug") references "team" ("id", "slug") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_assigned_teams" add constraint "content_master_assigned_teams_pkey" primary key ("content_master_id", "team_id", "team_slug");');

    this.addSql('alter table "attachment" rename column "tenant_id" to "tenant_slug";');
    this.addSql('alter table "attachment" add constraint "attachment_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');

    this.addSql('alter table "tenant" add column "name" text not null;');
    this.addSql('create index "tenant_name_index" on "tenant" ("name");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_tenant_slug_foreign";');

    this.addSql('alter table "user_image" drop constraint "user_image_tenant_slug_foreign";');

    this.addSql('alter table "tenant_image" drop constraint "tenant_image_tenant_slug_foreign";');

    this.addSql('alter table "approval_step" drop constraint "approval_step_tenant_slug_foreign";');

    this.addSql('alter table "team" drop constraint "team_tenant_slug_foreign";');

    this.addSql('alter table "team_receipt" drop constraint "team_receipt_tenant_slug_foreign";');
    this.addSql('alter table "team_receipt" drop constraint "team_receipt_team_id_team_slug_foreign";');

    this.addSql('alter table "team_member" drop constraint "team_member_team_id_team_slug_foreign";');

    this.addSql('alter table "team_image" drop constraint "team_image_tenant_slug_foreign";');
    this.addSql('alter table "team_image" drop constraint "team_image_team_id_team_slug_foreign";');

    this.addSql('alter table "team_history" drop constraint "team_history_parent_id_parent_slug_foreign";');
    this.addSql('alter table "team_history" drop constraint "team_history_team_id_team_slug_foreign";');

    this.addSql('alter table "team_form" drop constraint "team_form_team_id_team_slug_foreign";');

    this.addSql('alter table "team_membership_request" drop constraint "team_membership_request_team_id_team_slug_foreign";');

    this.addSql('alter table "team_labels" drop constraint "team_labels_team_id_team_slug_foreign";');

    this.addSql('alter table "social" drop constraint "social_team_id_team_slug_foreign";');

    this.addSql('alter table "interest" drop constraint "interest_team_id_team_slug_foreign";');

    this.addSql('alter table "team_file" drop constraint "team_file_tenant_slug_foreign";');
    this.addSql('alter table "team_file" drop constraint "team_file_team_id_team_slug_foreign";');

    this.addSql('alter table "study_doc" drop constraint "study_doc_tenant_slug_foreign";');

    this.addSql('alter table "info_doc" drop constraint "info_doc_tenant_slug_foreign";');

    this.addSql('alter table "event" drop constraint "event_team_id_team_slug_foreign";');

    this.addSql('alter table "team_gallery" drop constraint "team_gallery_tenant_slug_foreign";');
    this.addSql('alter table "team_gallery" drop constraint "team_gallery_team_id_team_slug_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_team_id_team_slug_foreign";');

    this.addSql('alter table "content_master_assigned_teams" drop constraint "content_master_assigned_teams_team_id_team_slug_foreign";');

    this.addSql('alter table "attachment" drop constraint "attachment_tenant_slug_foreign";');

    this.addSql('alter table "user" alter column "bot" drop default;');
    this.addSql('alter table "user" alter column "bot" type boolean using ("bot"::boolean);');
    this.addSql('alter table "user" alter column "points" drop default;');
    this.addSql('alter table "user" alter column "points" type int using ("points"::int);');
    this.addSql('alter table "user" rename column "tenant_slug" to "tenant_id";');
    this.addSql('alter table "user" add constraint "user_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "user_image" rename column "tenant_slug" to "tenant_id";');
    this.addSql('alter table "user_image" add constraint "user_image_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('drop index "tenant_name_index";');
    this.addSql('alter table "tenant" drop constraint "tenant_pkey";');
    this.addSql('alter table "tenant" drop column "name";');
    this.addSql('alter table "tenant" rename column "slug" to "id";');
    this.addSql('alter table "tenant" add constraint "tenant_pkey" primary key ("id");');

    this.addSql('alter table "tenant_image" rename column "tenant_slug" to "tenant_id";');
    this.addSql('alter table "tenant_image" add constraint "tenant_image_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "approval_step" rename column "tenant_slug" to "tenant_id";');
    this.addSql('alter table "approval_step" add constraint "approval_step_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "team" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "team" alter column "id" type int using ("id"::int);');
    this.addSql('alter table "team" drop constraint "team_pkey";');
    this.addSql('alter table "team" add constraint "team_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team" drop column "slug";');
    this.addSql('alter table "team" drop column "tenant_slug";');
    this.addSql('create sequence if not exists "team_id_seq";');
    this.addSql('select setval(\'team_id_seq\', (select max("id") from "team"));');
    this.addSql('alter table "team" alter column "id" set default nextval(\'team_id_seq\');');
    this.addSql('alter table "team" add constraint "team_pkey" primary key ("id");');

    this.addSql('alter table "team_receipt" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team_receipt" drop column "tenant_slug";');
    this.addSql('alter table "team_receipt" drop column "team_slug";');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('drop index "team_member_team_id_team_slug_index";');
    this.addSql('alter table "team_member" drop column "team_slug";');
    this.addSql('alter table "team_member" add constraint "team_member_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('create index "team_member_team_id_index" on "team_member" ("team_id");');

    this.addSql('alter table "team_image" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "team_image" add constraint "team_image_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team_image" drop column "tenant_slug";');
    this.addSql('alter table "team_image" drop column "team_slug";');
    this.addSql('alter table "team_image" add constraint "team_image_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_history" drop column "parent_slug";');
    this.addSql('alter table "team_history" drop column "team_slug";');
    this.addSql('alter table "team_history" add constraint "team_history_parent_id_foreign" foreign key ("parent_id") references "team" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_history" add constraint "team_history_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('drop index "team_form_team_id_team_slug_index";');
    this.addSql('alter table "team_form" drop column "team_slug";');
    this.addSql('alter table "team_form" add constraint "team_form_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('create index "team_form_team_id_index" on "team_form" ("team_id");');

    this.addSql('drop index "team_membership_request_team_id_team_slug_index";');
    this.addSql('alter table "team_membership_request" drop column "team_slug";');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('create index "team_membership_request_team_id_index" on "team_membership_request" ("team_id");');

    this.addSql('alter table "team_labels" drop constraint "team_labels_pkey";');
    this.addSql('alter table "team_labels" drop column "team_slug";');
    this.addSql('alter table "team_labels" add constraint "team_labels_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_labels" add constraint "team_labels_pkey" primary key ("team_id", "label_id");');

    this.addSql('drop index "social_team_id_team_slug_index";');
    this.addSql('alter table "social" drop column "team_slug";');
    this.addSql('alter table "social" add constraint "social_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('create index "social_team_id_index" on "social" ("team_id");');

    this.addSql('alter table "interest" drop constraint "interest_team_id_team_slug_user_id_unique";');
    this.addSql('alter table "interest" drop column "team_slug";');
    this.addSql('alter table "interest" add constraint "interest_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "interest" add constraint "interest_team_id_user_id_unique" unique ("team_id", "user_id");');

    this.addSql('alter table "team_file" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "team_file" add constraint "team_file_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team_file" drop column "tenant_slug";');
    this.addSql('alter table "team_file" drop column "team_slug";');
    this.addSql('alter table "team_file" add constraint "team_file_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "study_doc" rename column "tenant_slug" to "tenant_id";');
    this.addSql('alter table "study_doc" add constraint "study_doc_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "info_doc" rename column "tenant_slug" to "tenant_id";');
    this.addSql('alter table "info_doc" add constraint "info_doc_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('drop index "event_team_id_team_slug_index";');
    this.addSql('alter table "event" drop column "team_slug";');
    this.addSql('alter table "event" add constraint "event_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('create index "event_team_id_index" on "event" ("team_id");');

    this.addSql('alter table "team_gallery" add column "tenant_id" varchar(255) not null;');
    this.addSql('alter table "team_gallery" add constraint "team_gallery_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team_gallery" drop column "tenant_slug";');
    this.addSql('alter table "team_gallery" drop column "team_slug";');
    this.addSql('alter table "team_gallery" add constraint "team_gallery_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('drop index "team_finance_team_id_team_slug_index";');
    this.addSql('alter table "team_finance" drop column "team_slug";');
    this.addSql('alter table "team_finance" add constraint "team_finance_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('create index "team_finance_team_id_index" on "team_finance" ("team_id");');

    this.addSql('alter table "content_master_assigned_teams" drop constraint "content_master_assigned_teams_pkey";');
    this.addSql('alter table "content_master_assigned_teams" drop column "team_slug";');
    this.addSql('alter table "content_master_assigned_teams" add constraint "content_master_assigned_teams_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_assigned_teams" add constraint "content_master_assigned_teams_pkey" primary key ("content_master_id", "team_id");');

    this.addSql('alter table "attachment" rename column "tenant_slug" to "tenant_id";');
    this.addSql('alter table "attachment" add constraint "attachment_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
  }

}
