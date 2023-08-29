import { Migration } from '@mikro-orm/migrations';

export class Migration20230829021458 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "subject_class_groups" drop constraint "subject_class_groups_subject_id_foreign";');

    this.addSql('alter table "class_group_teacher_subjects" drop constraint "class_group_teacher_subjects_subject_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_subject_id_foreign";');

    this.addSql('alter table "class_group_teacher_subjects" drop constraint "class_group_teacher_subjects_class_group_teacher_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_canteen_id_foreign";');

    this.addSql('alter table "canteen_menu" drop constraint "canteen_menu_canteen_id_foreign";');

    this.addSql('alter table "canteen_food" drop constraint "canteen_food_canteen_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_parent_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_replying_to_id_foreign";');

    this.addSql('alter table "thread" drop constraint "thread_content_id_foreign";');

    this.addSql('alter table "report" drop constraint "report_content_id_foreign";');

    this.addSql('alter table "reaction" drop constraint "reaction_content_id_foreign";');

    this.addSql('alter table "issue" drop constraint "issue_content_id_foreign";');

    this.addSql('alter table "favorite" drop constraint "favorite_content_id_foreign";');

    this.addSql('alter table "content_attachments" drop constraint "content_attachments_content_id_foreign";');

    this.addSql('alter table "validation" drop constraint "validation_content_id_foreign";');

    this.addSql('alter table "view" drop constraint "view_content_id_foreign";');

    this.addSql('alter table "vote" drop constraint "vote_content_id_foreign";');

    this.addSql('alter table "thread_tags" drop constraint "thread_tags_thread_id_foreign";');

    this.addSql('alter table "thread_contributors" drop constraint "thread_contributors_thread_id_foreign";');

    this.addSql('alter table "issue_tags" drop constraint "issue_tags_issue_id_foreign";');

    this.addSql('alter table "issue_contributors" drop constraint "issue_contributors_issue_id_foreign";');

    this.addSql('drop table if exists "team_metric" cascade;');

    this.addSql('drop table if exists "subject" cascade;');

    this.addSql('drop table if exists "subject_class_groups" cascade;');

    this.addSql('drop table if exists "class_group_teacher" cascade;');

    this.addSql('drop table if exists "class_group_teacher_subjects" cascade;');

    this.addSql('drop table if exists "canteen" cascade;');

    this.addSql('drop table if exists "canteen_menu" cascade;');

    this.addSql('drop table if exists "canteen_food" cascade;');

    this.addSql('drop table if exists "content" cascade;');

    this.addSql('drop table if exists "thread" cascade;');

    this.addSql('drop table if exists "thread_tags" cascade;');

    this.addSql('drop table if exists "thread_contributors" cascade;');

    this.addSql('drop table if exists "report" cascade;');

    this.addSql('drop table if exists "reaction" cascade;');

    this.addSql('drop table if exists "issue" cascade;');

    this.addSql('drop table if exists "issue_tags" cascade;');

    this.addSql('drop table if exists "issue_contributors" cascade;');

    this.addSql('drop table if exists "favorite" cascade;');

    this.addSql('drop table if exists "content_attachments" cascade;');

    this.addSql('drop table if exists "validation" cascade;');

    this.addSql('drop table if exists "view" cascade;');

    this.addSql('drop table if exists "vote" cascade;');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "team" drop constraint "team_canteen_id_unique";');
    this.addSql('alter table "team" drop column "canteen_id";');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'User\', \'Tenant\', \'TenantOrganize\', \'Campus\', \'CampusCluster\', \'Actor\', \'BankInfo\', \'Address\', \'Location\', \'ActorImage\', \'LegalUnit\', \'LegalUnitLocation\', \'Social\', \'Tag\', \'Follow\', \'Session\', \'Shortcut\', \'Team\', \'TeamHistory\', \'Action\', \'Mission\', \'MissionJoin\', \'Pole\', \'Role\', \'TeamMemberRole\', \'BankAccount\', \'BankAccountAllocate\', \'Expense\', \'ExpenseItem\', \'Finance\', \'TeamJoin\', \'TeamMember\', \'Grant\', \'GrantUnlock\', \'ClassGroup\', \'Cohort\', \'Project\', \'Event\', \'EventApproval\', \'EventApprovalStep\', \'EventFavorite\', \'EventJoin\', \'EventOrganize\', \'EventSupervisor\', \'FileUpload\', \'Form\', \'FormSubmission\', \'Document\'));');

    this.addSql('alter table "document" drop column "subject_id";');
  }

  async down(): Promise<void> {
    this.addSql('create table "team_metric" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "value" text not null, "type" text check ("type" in (\'MemberInOrgAndChildrenCount\', \'MemberInOrgAndChildrenUniqueCount\', \'EventOccuringCount\', \'EventCreatedCount\', \'ProjectCreatedCount\', \'ContentCreatedCount\', \'ChildOrgCount\')) not null, constraint "team_metric_pkey" primary key ("id"));');

    this.addSql('create table "subject" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "english_name" text not null default \'\', "description" text not null default \'\', "code" text not null, "type" text check ("type" in (\'Mathematics\', \'Physics\', \'English\', \'Communication\', \'Programming\')) not null, constraint "subject_pkey" primary key ("id"));');
    this.addSql('create index "subject_code_index" on "subject" ("code");');

    this.addSql('create table "subject_class_groups" ("subject_id" bigint not null, "class_group_id" bigint not null, constraint "subject_class_groups_pkey" primary key ("subject_id", "class_group_id"));');

    this.addSql('create table "class_group_teacher" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "user_id" bigint not null, "class_group_id" bigint not null, "start_date" timestamptz(0) not null, "end_date" timestamptz(0) null default null, constraint "class_group_teacher_pkey" primary key ("id"));');

    this.addSql('create table "class_group_teacher_subjects" ("class_group_teacher_id" bigint not null, "subject_id" bigint not null, constraint "class_group_teacher_subjects_pkey" primary key ("class_group_teacher_id", "subject_id"));');

    this.addSql('create table "canteen" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "description" text not null default \'\', constraint "canteen_pkey" primary key ("id"));');

    this.addSql('create table "canteen_menu" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "canteen_id" bigint not null, constraint "canteen_menu_pkey" primary key ("id"));');

    this.addSql('create table "canteen_food" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "canteen_id" bigint not null, constraint "canteen_food_pkey" primary key ("id"));');

    this.addSql('create table "content" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "text" text not null, "is_anonymous" boolean not null default false, "parent_id" bigint null default null, "replying_to_id" bigint null default null, "team_id" bigint null default null, constraint "content_pkey" primary key ("id"));');

    this.addSql('create table "thread" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "slug" text not null, "content_id" bigint not null, constraint "thread_pkey" primary key ("id"));');
    this.addSql('alter table "thread" add constraint "thread_content_id_unique" unique ("content_id");');

    this.addSql('create table "thread_tags" ("thread_id" bigint not null, "tag_id" bigint not null, constraint "thread_tags_pkey" primary key ("thread_id", "tag_id"));');

    this.addSql('create table "thread_contributors" ("thread_id" bigint not null, "user_id" bigint not null, constraint "thread_contributors_pkey" primary key ("thread_id", "user_id"));');

    this.addSql('create table "report" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'Harassment\', \'Spam\', \'Inappropriate\', \'Other\')) not null, "reason" text not null default \'\', "actor_id" bigint null default null, "content_id" bigint null default null, constraint "report_pkey" primary key ("id"));');

    this.addSql('create table "reaction" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "reaction_type" text check ("reaction_type" in (\'What\', \'Interesting\', \'Like\', \'NotAnIssue\', \'Bump\', \'Laugh\', \'Unsure\', \'Partial\', \'Perfect\')) not null, "content_id" bigint null default null, constraint "reaction_pkey" primary key ("id"));');
    this.addSql('create index "reaction_reaction_type_index" on "reaction" ("reaction_type");');

    this.addSql('create table "issue" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "slug" text not null, "content_id" bigint not null, constraint "issue_pkey" primary key ("id"));');
    this.addSql('alter table "issue" add constraint "issue_content_id_unique" unique ("content_id");');

    this.addSql('create table "issue_tags" ("issue_id" bigint not null, "tag_id" bigint not null, constraint "issue_tags_pkey" primary key ("issue_id", "tag_id"));');

    this.addSql('create table "issue_contributors" ("issue_id" bigint not null, "user_id" bigint not null, constraint "issue_contributors_pkey" primary key ("issue_id", "user_id"));');

    this.addSql('create table "favorite" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "content_id" bigint not null, constraint "favorite_pkey" primary key ("id"));');

    this.addSql('create table "content_attachments" ("content_id" bigint not null, "file_upload_id" bigint not null, constraint "content_attachments_pkey" primary key ("content_id", "file_upload_id"));');

    this.addSql('create table "validation" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" varchar(255) not null, "content_id" bigint null default null, constraint "validation_pkey" primary key ("id"));');

    this.addSql('create table "view" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "content_id" bigint null default null, constraint "view_pkey" primary key ("id"));');

    this.addSql('create table "vote" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "value" smallint not null, "content_id" bigint null default null, constraint "vote_pkey" primary key ("id"));');

    this.addSql('alter table "team_metric" add constraint "team_metric_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_metric" add constraint "team_metric_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "subject" add constraint "subject_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "subject" add constraint "subject_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "subject_class_groups" add constraint "subject_class_groups_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "subject_class_groups" add constraint "subject_class_groups_class_group_id_foreign" foreign key ("class_group_id") references "class_group" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_class_group_id_foreign" foreign key ("class_group_id") references "class_group" ("id") on update cascade;');

    this.addSql('alter table "class_group_teacher_subjects" add constraint "class_group_teacher_subjects_class_group_teacher_id_foreign" foreign key ("class_group_teacher_id") references "class_group_teacher" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "class_group_teacher_subjects" add constraint "class_group_teacher_subjects_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "canteen" add constraint "canteen_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "canteen" add constraint "canteen_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "canteen_menu" add constraint "canteen_menu_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "canteen_menu" add constraint "canteen_menu_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "canteen_menu" add constraint "canteen_menu_canteen_id_foreign" foreign key ("canteen_id") references "canteen" ("id") on update cascade;');

    this.addSql('alter table "canteen_food" add constraint "canteen_food_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "canteen_food" add constraint "canteen_food_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "canteen_food" add constraint "canteen_food_canteen_id_foreign" foreign key ("canteen_id") references "canteen" ("id") on update cascade;');

    this.addSql('alter table "content" add constraint "content_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content" add constraint "content_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "content" add constraint "content_parent_id_foreign" foreign key ("parent_id") references "content" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content" add constraint "content_replying_to_id_foreign" foreign key ("replying_to_id") references "content" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content" add constraint "content_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;');

    this.addSql('alter table "thread" add constraint "thread_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "thread" add constraint "thread_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "thread" add constraint "thread_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "thread_tags" add constraint "thread_tags_thread_id_foreign" foreign key ("thread_id") references "thread" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "thread_tags" add constraint "thread_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "thread_contributors" add constraint "thread_contributors_thread_id_foreign" foreign key ("thread_id") references "thread" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "thread_contributors" add constraint "thread_contributors_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "report" add constraint "report_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "report" add constraint "report_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "report" add constraint "report_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete set null;');
    this.addSql('alter table "report" add constraint "report_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "reaction" add constraint "reaction_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "reaction" add constraint "reaction_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "reaction" add constraint "reaction_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "issue" add constraint "issue_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "issue" add constraint "issue_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "issue" add constraint "issue_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "issue_tags" add constraint "issue_tags_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "issue_tags" add constraint "issue_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "issue_contributors" add constraint "issue_contributors_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "issue_contributors" add constraint "issue_contributors_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "favorite" add constraint "favorite_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "favorite" add constraint "favorite_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "favorite" add constraint "favorite_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade;');

    this.addSql('alter table "content_attachments" add constraint "content_attachments_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_attachments" add constraint "content_attachments_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "validation" add constraint "validation_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "validation" add constraint "validation_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "validation" add constraint "validation_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "view" add constraint "view_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "view" add constraint "view_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "view" add constraint "view_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "vote" add constraint "vote_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "vote" add constraint "vote_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "vote" add constraint "vote_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "team" add column "canteen_id" bigint null default null;');
    this.addSql('alter table "team" add constraint "team_canteen_id_foreign" foreign key ("canteen_id") references "canteen" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_canteen_id_unique" unique ("canteen_id");');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'User\', \'Tenant\', \'TenantOrganize\', \'Campus\', \'CampusCluster\', \'Actor\', \'BankInfo\', \'Address\', \'Location\', \'ActorImage\', \'LegalUnit\', \'LegalUnitLocation\', \'Social\', \'Tag\', \'Follow\', \'Session\', \'Shortcut\', \'Team\', \'TeamHistory\', \'Action\', \'Mission\', \'MissionJoin\', \'Pole\', \'Role\', \'TeamMemberRole\', \'BankAccount\', \'BankAccountAllocate\', \'Expense\', \'ExpenseItem\', \'Finance\', \'TeamJoin\', \'TeamMember\', \'TeamMetric\', \'Grant\', \'GrantUnlock\', \'Canteen\', \'CanteenFood\', \'CanteenMenu\', \'ClassGroup\', \'ClassGroupTeacher\', \'Cohort\', \'Project\', \'Event\', \'EventApproval\', \'EventApprovalStep\', \'EventFavorite\', \'EventJoin\', \'EventOrganize\', \'EventSupervisor\', \'FileUpload\', \'Form\', \'FormSubmission\', \'Content\', \'Thread\', \'Issue\', \'Favorite\', \'Reaction\', \'Report\', \'Validation\', \'View\', \'Vote\', \'Document\', \'Subject\'));');

    this.addSql('alter table "document" add column "subject_id" bigint null default null;');
    this.addSql('alter table "document" add constraint "document_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade on delete set null;');
  }

}
