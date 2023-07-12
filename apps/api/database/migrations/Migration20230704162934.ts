import { Migration } from '@mikro-orm/migrations';

export class Migration20230704162934 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "first_name" text not null, "middle_names" text[] not null default \'{}\', "last_name" text not null, "points" real not null default 0, "is_onboarding_finished" boolean not null default false, "is_introduction_finished" boolean not null default false, "is_dark_mode_preferred" boolean not null default false, "is_data_exported_on_deactivation" boolean not null default true, "is_data_anonymized_on_deactivation" boolean not null default false, constraint "user_pkey" primary key ("id"));');

    this.addSql('create table "actor" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "slug" text not null, "name" text not null, "status" text not null default \'\', "bio" text not null default \'\', "email" text not null default \'\', "website" text not null default \'\', "ical" text not null default "public"."id_generator"(21), constraint "actor_pkey" primary key ("id"));');
    this.addSql('alter table "actor" add constraint "actor_slug_unique" unique ("slug");');
    this.addSql('alter table "actor" add constraint "actor_ical_unique" unique ("ical");');

    this.addSql('create table "individual" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "password_hash" text null default null, "content_signature" text not null default \'\', "actor_id" bigint not null, "user_id" bigint null default null, "bot_id" bigint null default null, constraint "individual_pkey" primary key ("id"));');
    this.addSql('alter table "individual" add constraint "individual_actor_id_unique" unique ("actor_id");');
    this.addSql('alter table "individual" add constraint "individual_user_id_unique" unique ("user_id");');
    this.addSql('alter table "individual" add constraint "individual_bot_id_unique" unique ("bot_id");');

    this.addSql('create table "tenant" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "domain" text not null, "name" text not null, "point_name" text not null, "is_oidc_enabled" boolean not null default true, "oidc_name" text not null default \'\', "oidc_client_id" text not null default \'\', "oidc_client_secret" text not null default \'\', "oidc_discovery_url" text not null default \'\', "oidc_scopes" text not null default \'\', "oidc_callback_uri" text not null default \'\', "event_validation_form_id" bigint null default null, constraint "tenant_pkey" primary key ("id"));');
    this.addSql('alter table "tenant" add constraint "tenant_domain_unique" unique ("domain");');
    this.addSql('alter table "tenant" add constraint "tenant_event_validation_form_id_unique" unique ("event_validation_form_id");');

    this.addSql('create table "team_metric" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "value" text not null, "type" text check ("type" in (\'MemberInOrgAndChildrenCount\', \'MemberInOrgAndChildrenUniqueCount\', \'MemberInOrgAndChildrenUniqueCount\', \'EventOccuringCount\', \'EventCreatedCount\', \'EventOccuringCount\', \'EventCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ContentCreatedCount\', \'ContentCreatedCount\', \'ChildOrgCount\')) not null, constraint "team_metric_pkey" primary key ("id"));');

    this.addSql('create table "subject" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "english_name" text not null default \'\', "description" text not null default \'\', "code" text not null, "type" text check ("type" in (\'Mathematics\', \'Physics\', \'English\', \'Communication\', \'Programming\')) not null, "last_active_date" timestamptz(0) null default null, constraint "subject_pkey" primary key ("id"));');
    this.addSql('create index "subject_code_index" on "subject" ("code");');

    this.addSql('create table "social" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "actor_id" bigint not null, "order" smallint not null, "type" text check ("type" in (\'Discord\', \'GitHub\', \'TikTok\', \'LinkedIn\', \'Instagram\', \'Facebook\', \'YouTube\', \'Twitch\')) not null, "pseudo" text not null, "url" text not null, constraint "social_pkey" primary key ("id"));');

    this.addSql('create table "shortcut" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'Team\', \'Project\', \'User\', \'Event\')) not null, "user_id" bigint not null, "target_actor_id" bigint not null, constraint "shortcut_pkey" primary key ("id"));');

    this.addSql('create table "session" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "ip" varchar(255) not null, "country" varchar(255) not null, "client_type" text check ("client_type" in (\'WebClient\', \'MobileClient\', \'DesktopClient\')) not null, "user_agent" jsonb not null, "refresh_token_hash" varchar(255) not null, "token_family" varchar(255) not null, "user_id" bigint not null, "last_activity_at" timestamptz(0) not null default current_timestamp, "last_issued_at" timestamptz(0) not null default current_timestamp, "revoked_at" timestamptz(0) null default null, "expired_at" timestamptz(0) null default null, constraint "session_pkey" primary key ("id"));');

    this.addSql('create table "legal_unit" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "type" text check ("type" in (\'Bank\', \'Company\', \'Association\', \'TenantGrantFund\')) not null, "siren" varchar(255) null default null, "headquarters_nic" varchar(255) null default null, "headquarters_location" varchar(255) null default null, "legal_category" varchar(255) null default null, "activity_category" varchar(255) null default null, "legal_name" varchar(255) not null, "bank_code" int null default null, "actor_id" bigint not null, "parent_id" bigint null default null, constraint "legal_unit_pkey" primary key ("id"));');
    this.addSql('alter table "legal_unit" add constraint "legal_unit_actor_id_unique" unique ("actor_id");');

    this.addSql('create table "form" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "schema" jsonb not null, "type" text check ("type" in (\'Event\', \'Team\', \'Internal\', \'Survey\')) not null, "is_enabled" boolean not null default true, "is_allowing_multiple_answers" boolean not null default false, "is_allowing_editing_answers" boolean not null default true, "is_required" boolean not null default false, constraint "form_pkey" primary key ("id"));');

    this.addSql('create table "form_submission" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "submission" jsonb not null, "form_id" bigint not null, constraint "form_submission_pkey" primary key ("id"));');

    this.addSql('create table "file_upload" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "size" int not null, "type" text not null, "url" text not null, "file_last_modified_at" timestamptz(0) not null default current_timestamp, constraint "file_upload_pkey" primary key ("id"));');

    this.addSql('create table "tag" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'TeamCategory\', \'Finance\', \'Tag\')) not null, "name" text not null, "slug" text not null, "description" text not null default \'\', "image_id" bigint null default null, "color" text check ("color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\')) not null, constraint "tag_pkey" primary key ("id"));');

    this.addSql('create table "event_approval_step" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" varchar(255) not null, "description" varchar(255) not null default \'\', "previous_step_id" bigint null default null, constraint "event_approval_step_pkey" primary key ("id"));');

    this.addSql('create table "event_approval_step_validators" ("event_approval_step_id" bigint not null, "individual_id" bigint not null, constraint "event_approval_step_validators_pkey" primary key ("event_approval_step_id", "individual_id"));');

    this.addSql('create table "event_approval_step_notifiees" ("event_approval_step_id" bigint not null, "individual_id" bigint not null, constraint "event_approval_step_notifiees_pkey" primary key ("event_approval_step_id", "individual_id"));');

    this.addSql('create table "cohort" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "year" smallint not null, constraint "cohort_pkey" primary key ("id"));');

    this.addSql('create table "class_group" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "description" text not null default \'\', "type" text check ("type" in (\'All\', \'Program\', \'Year\', \'Sector\', \'Class\')) not null, constraint "class_group_pkey" primary key ("id"));');

    this.addSql('create table "subject_class_groups" ("subject_id" bigint not null, "class_group_id" bigint not null, constraint "subject_class_groups_pkey" primary key ("subject_id", "class_group_id"));');

    this.addSql('create table "canteen" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "description" text not null default \'\', constraint "canteen_pkey" primary key ("id"));');

    this.addSql('create table "team" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'Association\', \'Canteen\', \'Company\', \'Club\', \'Project\', \'Department\', \'Tenant\')) not null default \'Club\', "membership_fees" real not null default 0, "membership_duration" text not null default \'\', "directors_category_name" text not null default \'Directors\', "managers_category_name" text not null default \'Managers\', "members_category_name" text not null default \'Members\', "is_join_form_active" boolean not null default true, "join_form_id" bigint not null, "actor_id" bigint not null, "canteen_id" bigint null default null, "cohort_id" bigint null default null, "class_group_id" bigint null default null, "tenant_grant_fund_id" bigint null default null, "video_id" bigint null default null, "parent_id" bigint null default null, constraint "team_pkey" primary key ("id"));');
    this.addSql('alter table "team" add constraint "team_join_form_id_unique" unique ("join_form_id");');
    this.addSql('alter table "team" add constraint "team_actor_id_unique" unique ("actor_id");');
    this.addSql('alter table "team" add constraint "team_canteen_id_unique" unique ("canteen_id");');
    this.addSql('alter table "team" add constraint "team_cohort_id_unique" unique ("cohort_id");');
    this.addSql('alter table "team" add constraint "team_class_group_id_unique" unique ("class_group_id");');

    this.addSql('create table "team_member" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "team_id" bigint not null, "user_id" bigint not null, "permissions" int not null default 0, "start_date" timestamptz(0) not null default CURRENT_TIMESTAMP, "end_date" timestamptz(0) null default null, constraint "team_member_pkey" primary key ("id"));');

    this.addSql('create table "team_history" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "approximate_date" text check ("approximate_date" in (\'Exact\', \'Year\', \'Month\', \'Day\', \'Time\')) not null, "event_date" timestamptz(0) not null, "event_type" text check ("event_type" in (\'Defunct\', \'Restart\', \'End\', \'Start\', \'LegalStart\', \'LegalEnd\', \'RegularAssembly\', \'ExtraordinaryAssembly\', \'OkampusEnd\', \'OkampusStart\')) not null, "team_id" bigint not null, constraint "team_history_pkey" primary key ("id"));');

    this.addSql('create table "role" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "permissions" text[] not null default \'{}\', "team_id" bigint not null, "category" text check ("category" in (\'Directors\', \'Managers\', \'Members\')) not null, "type" text check ("type" in (\'Director\', \'Treasurer\', \'Secretary\', \'Member\')) not null default \'Member\', "is_required" boolean not null default true, constraint "role_pkey" primary key ("id"));');

    this.addSql('create table "team_member_roles" ("team_member_id" bigint not null, "role_id" bigint not null, constraint "team_member_roles_pkey" primary key ("team_member_id", "role_id"));');

    this.addSql('create table "pole" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "team_id" bigint not null, "name" text not null, "description" text not null, "is_required" boolean not null default false, "category" text check ("category" in (\'Administration\', \'Communication\', \'Members\', \'Relations\', \'Activity\')) not null, constraint "pole_pkey" primary key ("id"));');

    this.addSql('create table "team_join" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "state" text check ("state" in (\'Approved\', \'Rejected\', \'Canceled\', \'Pending\')) not null default \'Pending\', "joined_by_id" bigint not null, "processed_by_id" bigint null default null, "processed_at" timestamptz(0) null default null, "form_submission_id" bigint null default null, "team_id" bigint not null, "asked_role_id" bigint not null, "received_role_id" bigint null default null, "received_pole_id" bigint null default null, constraint "team_join_pkey" primary key ("id"));');

    this.addSql('create table "grant" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "asked_amount" real not null, "received_amount" real not null, "state" text check ("state" in (\'Canceled\', \'Ongoing\', \'Completed\')) not null default \'Completed\', "received_amount_processed_by_id" bigint null default null, "received_amount_processed_at" timestamptz(0) null default null, "team_id" bigint not null, "signature_id" bigint null default null, "generated_document_id" bigint null default null, constraint "grant_pkey" primary key ("id"));');

    this.addSql('create table "project" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "description" text not null default \'\', "slug" text not null, "color" text check ("color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\')) not null default \'Blue\', "budget" real not null default 0, "regular_event_interval" text not null default \'\', "is_private" boolean not null default false, "is_template" boolean not null default false, "team_id" bigint not null, "banner_id" bigint null default null, "grant_id" bigint null default null, constraint "project_pkey" primary key ("id"));');

    this.addSql('create table "project_tags" ("project_id" bigint not null, "tag_id" bigint not null, constraint "project_tags_pkey" primary key ("project_id", "tag_id"));');

    this.addSql('create table "project_supervisors" ("project_id" bigint not null, "team_member_id" bigint not null, constraint "project_supervisors_pkey" primary key ("project_id", "team_member_id"));');

    this.addSql('create table "grant_attachments" ("grant_id" bigint not null, "file_upload_id" bigint not null, constraint "grant_attachments_pkey" primary key ("grant_id", "file_upload_id"));');

    this.addSql('create table "document" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "description" text not null, "year_version" smallint null default null, "type" text check ("type" in (\'TenantGuide\', \'AssociationConstitution\', \'AssociationDeclaration\', \'ClubHandover\', \'ClubCharter\', \'TeamMeetingTranscript\', \'TeamGraphicCharter\', \'Other\')) not null, "file_id" bigint null, "subject_id" bigint null default null, "team_id" bigint null default null, constraint "document_pkey" primary key ("id"));');
    this.addSql('alter table "document" add constraint "document_file_id_unique" unique ("file_id");');

    this.addSql('create table "content" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "text" text not null, "is_anonymous" boolean not null default false, "parent_id" bigint null default null, "replying_to_id" bigint null default null, "team_id" bigint null default null, constraint "content_pkey" primary key ("id"));');

    this.addSql('create table "thread" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "slug" text not null, "content_id" bigint not null, constraint "thread_pkey" primary key ("id"));');
    this.addSql('alter table "thread" add constraint "thread_content_id_unique" unique ("content_id");');

    this.addSql('create table "thread_tags" ("thread_id" bigint not null, "tag_id" bigint not null, constraint "thread_tags_pkey" primary key ("thread_id", "tag_id"));');

    this.addSql('create table "thread_contributors" ("thread_id" bigint not null, "individual_id" bigint not null, constraint "thread_contributors_pkey" primary key ("thread_id", "individual_id"));');

    this.addSql('create table "report" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'Harassment\', \'Spam\', \'Inappropriate\', \'Other\')) not null, "reason" text not null default \'\', "last_active_date" timestamptz(0) null default null, "actor_id" bigint null default null, "content_id" bigint null default null, constraint "report_pkey" primary key ("id"));');

    this.addSql('create table "reaction" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "reaction_type" text check ("reaction_type" in (\'What\', \'Interesting\', \'Like\', \'NotAnIssue\', \'Bump\', \'Laugh\', \'Unsure\', \'Partial\', \'Perfect\')) not null, "last_active_date" timestamptz(0) null default null, "content_id" bigint null default null, constraint "reaction_pkey" primary key ("id"));');
    this.addSql('create index "reaction_reaction_type_index" on "reaction" ("reaction_type");');

    this.addSql('create table "issue" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "slug" text not null, "content_id" bigint not null, constraint "issue_pkey" primary key ("id"));');
    this.addSql('alter table "issue" add constraint "issue_content_id_unique" unique ("content_id");');

    this.addSql('create table "issue_tags" ("issue_id" bigint not null, "tag_id" bigint not null, constraint "issue_tags_pkey" primary key ("issue_id", "tag_id"));');

    this.addSql('create table "issue_contributors" ("issue_id" bigint not null, "individual_id" bigint not null, constraint "issue_contributors_pkey" primary key ("issue_id", "individual_id"));');

    this.addSql('create table "content_attachments" ("content_id" bigint not null, "file_upload_id" bigint not null, constraint "content_attachments_pkey" primary key ("content_id", "file_upload_id"));');

    this.addSql('create table "canteen_menu" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "canteen_id" bigint not null, constraint "canteen_menu_pkey" primary key ("id"));');

    this.addSql('create table "canteen_food" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "canteen_id" bigint not null, constraint "canteen_food_pkey" primary key ("id"));');

    this.addSql('create table "campus_cluster" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, constraint "campus_cluster_pkey" primary key ("id"));');

    this.addSql('create table "tenant_manage" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "campus_cluster_id" bigint null default null, "team_id" bigint not null, "type" text check ("type" in (\'Admin\', \'ClusterManager\')) not null, constraint "tenant_manage_pkey" primary key ("id"));');

    this.addSql('create table "admin_role" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "individual_id" bigint not null, "tenant_id" bigint null default null, "permissions" text[] not null default \'{}\', constraint "admin_role_pkey" primary key ("id"));');

    this.addSql('create table "address" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "latitude" real null default null, "longitude" real null default null, "category" text not null default \'\', "name" text not null default \'\', "street_number" text not null, "street" text not null, "zip" text not null, "city" text not null, "state" text not null default \'\', "country" text check ("country" in (\'AF\', \'AX\', \'AL\', \'DZ\', \'AS\', \'AD\', \'AO\', \'AI\', \'AQ\', \'AG\', \'AR\', \'AM\', \'AW\', \'AU\', \'AT\', \'AZ\', \'BS\', \'BH\', \'BD\', \'BB\', \'BY\', \'BE\', \'BZ\', \'BJ\', \'BM\', \'BT\', \'BO\', \'BQ\', \'BA\', \'BW\', \'BV\', \'BR\', \'IO\', \'BN\', \'BG\', \'BF\', \'BI\', \'KH\', \'CM\', \'CA\', \'CV\', \'KY\', \'CF\', \'TD\', \'CL\', \'CN\', \'CX\', \'CC\', \'CO\', \'KM\', \'CG\', \'CD\', \'CK\', \'CR\', \'CI\', \'HR\', \'CU\', \'CW\', \'CY\', \'CZ\', \'DK\', \'DJ\', \'DM\', \'DO\', \'EC\', \'EG\', \'SV\', \'GQ\', \'ER\', \'EE\', \'ET\', \'FK\', \'FO\', \'FJ\', \'FI\', \'FR\', \'GF\', \'PF\', \'TF\', \'GA\', \'GM\', \'GE\', \'DE\', \'GH\', \'GI\', \'GR\', \'GL\', \'GD\', \'GP\', \'GU\', \'GT\', \'GG\', \'GN\', \'GW\', \'GY\', \'HT\', \'HM\', \'VA\', \'HN\', \'HK\', \'HU\', \'IS\', \'IN\', \'ID\', \'IR\', \'IQ\', \'IE\', \'IM\', \'IL\', \'IT\', \'JM\', \'JP\', \'JE\', \'JO\', \'KZ\', \'KE\', \'KI\', \'KR\', \'KP\', \'KW\', \'KG\', \'LA\', \'LV\', \'LB\', \'LS\', \'LR\', \'LY\', \'LI\', \'LT\', \'LU\', \'MO\', \'MK\', \'MG\', \'MW\', \'MY\', \'MV\', \'ML\', \'MT\', \'MH\', \'MQ\', \'MR\', \'MU\', \'YT\', \'MX\', \'FM\', \'MD\', \'MC\', \'MN\', \'ME\', \'MS\', \'MA\', \'MZ\', \'MM\', \'NA\', \'NR\', \'NP\', \'NL\', \'NC\', \'NZ\', \'NI\', \'NE\', \'NG\', \'NU\', \'NF\', \'MP\', \'NO\', \'OM\', \'PK\', \'PW\', \'PS\', \'PA\', \'PG\', \'PY\', \'PE\', \'PH\', \'PN\', \'PL\', \'PT\', \'PR\', \'QA\', \'RE\', \'RO\', \'RU\', \'RW\', \'BL\', \'SH\', \'KN\', \'LC\', \'MF\', \'PM\', \'VC\', \'WS\', \'SM\', \'ST\', \'SA\', \'SN\', \'RS\', \'SC\', \'SL\', \'SG\', \'SX\', \'SK\', \'SI\', \'SB\', \'SO\', \'ZA\', \'GS\', \'SS\', \'ES\', \'LK\', \'SD\', \'SR\', \'SJ\', \'SZ\', \'SE\', \'CH\', \'SY\', \'TW\', \'TJ\', \'TZ\', \'TH\', \'TL\', \'TG\', \'TK\', \'TO\', \'TT\', \'TN\', \'TR\', \'TM\', \'TC\', \'TV\', \'UG\', \'UA\', \'AE\', \'GB\', \'US\', \'UM\', \'UY\', \'UZ\', \'VU\', \'VE\', \'VN\', \'VG\', \'VI\', \'WF\', \'EH\', \'YE\', \'ZM\', \'ZW\')) not null default \'FR\', "geoapify_id" text null default null, constraint "address_pkey" primary key ("id"));');

    this.addSql('create table "location" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'Address\', \'Online\', \'Unspecificed\')) not null, "online_link" text not null default \'\', "location_note" text not null default \'\', "actor_id" bigint not null, "address_id" bigint null default null, constraint "location_pkey" primary key ("id"));');

    this.addSql('create table "location_images" ("location_id" bigint not null, "file_upload_id" bigint not null, constraint "location_images_pkey" primary key ("location_id", "file_upload_id"));');

    this.addSql('create table "legal_unit_location" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "location_type" text check ("location_type" in (\'Location\', \'Franchisee\')) not null default \'Location\', "nic" varchar(255) null default null, "legal_name" varchar(255) not null, "bank_location_code" int null default null, "actor_id" bigint not null, "legal_unit_id" bigint null default null, "location_id" bigint null default null, constraint "legal_unit_location_pkey" primary key ("id"));');
    this.addSql('alter table "legal_unit_location" add constraint "legal_unit_location_actor_id_unique" unique ("actor_id");');

    this.addSql('create table "event" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "name" text not null, "slug" text not null, "price" real not null default 0, "points_awarded_for_attendance" real not null default 0, "max_participants" smallint null default null, "state" text check ("state" in (\'Template\', \'Draft\', \'Submitted\', \'Rejected\', \'Approved\', \'Published\')) not null default \'Draft\', "is_private" boolean not null default false, "is_auto_accepting_joins" boolean not null default true, "is_template" boolean not null default false, "meta" jsonb not null default \'{}\', "location_id" bigint null default null, "content_id" bigint not null, "event_approval_submission_id" bigint null default null, "banner_id" bigint null default null, "join_form_id" bigint null default null, "project_id" bigint null default null, "last_event_approval_step_id" bigint null default null, constraint "event_pkey" primary key ("id"));');
    this.addSql('alter table "event" add constraint "event_slug_unique" unique ("slug");');
    this.addSql('create index "event_is_private_index" on "event" ("is_private");');
    this.addSql('alter table "event" add constraint "event_content_id_unique" unique ("content_id");');
    this.addSql('alter table "event" add constraint "event_event_approval_submission_id_unique" unique ("event_approval_submission_id");');

    this.addSql('create table "log" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "event_type" text check ("event_type" in (\'Create\', \'Update\', \'Delete\', \'Hide\')) not null, "context" text check ("context" in (\'User\', \'Bot\', \'CRON\', \'Seeding\', \'System\')) not null, "diff" jsonb not null default \'{}\', "entity_name" text check ("entity_name" in (\'Individual\', \'Bot\', \'User\', \'Tenant\', \'TenantManage\', \'Campus\', \'CampusCluster\', \'Actor\', \'BankInfo\', \'Address\', \'Location\', \'ActorImage\', \'LegalUnit\', \'LegalUnitLocation\', \'Social\', \'Tag\', \'Follow\', \'Session\', \'Shortcut\', \'Team\', \'TeamHistory\', \'Action\', \'Mission\', \'MissionJoin\', \'Pole\', \'Role\', \'Account\', \'AccountAllocate\', \'Expense\', \'ExpenseItem\', \'Finance\', \'TeamJoin\', \'TeamMember\', \'TeamMetric\', \'Grant\', \'GrantUnlock\', \'Canteen\', \'CanteenFood\', \'CanteenMenu\', \'ClassGroup\', \'ClassGroupTeacher\', \'Cohort\', \'Project\', \'Event\', \'EventManage\', \'EventJoin\', \'FileUpload\', \'Favorite\', \'Reaction\', \'Report\', \'Validation\', \'Vote\', \'EventApproval\', \'EventApprovalStep\', \'Content\', \'ContentMaster\', \'Issue\', \'Document\', \'Subject\', \'Form\', \'FormSubmission\')) not null, "entity_id" bigint not null, "note" text not null default \'\', "team_id" bigint null default null, "event_id" bigint null default null, "individual_id" bigint null default null, "tenant_id" bigint null default null, constraint "log_pkey" primary key ("id"));');

    this.addSql('create table "event_manage" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "description" text not null default \'\', "event_id" bigint not null, "team_id" bigint not null, constraint "event_manage_pkey" primary key ("id"));');

    this.addSql('create table "mission" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "description" text not null default \'\', "points_minimum" smallint not null, "points_maximum" smallint not null, "quantity" smallint not null default 1, "is_auto_accepting_members" boolean not null default false, "is_template" boolean not null default false, "color" text check ("color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\')) not null default \'Blue\', "team_id" bigint not null, "event_manage_id" bigint null default null, "project_id" bigint null default null, constraint "mission_pkey" primary key ("id"));');

    this.addSql('create table "event_manage_supervisors" ("event_manage_id" bigint not null, "team_member_id" bigint not null, constraint "event_manage_supervisors_pkey" primary key ("event_manage_id", "team_member_id"));');

    this.addSql('create table "event_approval" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "message" text not null default \'\', "is_approved" boolean not null, "event_id" bigint null, "event_approval_step_id" bigint null, constraint "event_approval_pkey" primary key ("id"));');

    this.addSql('create table "event_tags" ("event_id" bigint not null, "tag_id" bigint not null, constraint "event_tags_pkey" primary key ("event_id", "tag_id"));');

    this.addSql('create table "campus" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "location_id" bigint not null, "campus_cluster_id" bigint not null, constraint "campus_pkey" primary key ("id"));');

    this.addSql('create table "follow" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "followed_actor_id" bigint not null, constraint "follow_pkey" primary key ("id"));');

    this.addSql('create table "favorite" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "last_active_date" timestamptz(0) null default null, "content_id" bigint null default null, "actor_id" bigint null default null, constraint "favorite_pkey" primary key ("id"));');

    this.addSql('create table "bot" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "owner_id" bigint not null, constraint "bot_pkey" primary key ("id"));');

    this.addSql('create table "bank_info" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "actor_id" bigint not null, "bank_id" bigint null default null, "holder_name" text not null default \'\', "bic_swift" text not null, "iban" text not null, constraint "bank_info_pkey" primary key ("id"));');

    this.addSql('create table "expense" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "description" text not null, "state" text check ("state" in (\'Approved\', \'Rejected\', \'Canceled\', \'Pending\')) not null default \'Pending\', "last_notified_at" timestamptz(0) null default null, "processed_by_id" bigint null default null, "processed_at" timestamptz(0) null default null, "expense_report_id" bigint not null, "bank_info_id" bigint not null, constraint "expense_pkey" primary key ("id"));');

    this.addSql('create table "expense_item" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "description" text not null default \'\', "unit_cost" real not null, "quantity" smallint not null, "category" text check ("category" in (\'Entertainment\', \'Equipment\', \'Errands\', \'MemberReimbursement\', \'MembershipFees\', \'Subvention\', \'Marketing\', \'Subscriptions\', \'Transportation\', \'Other\', \'Unknown\')) not null default \'Unknown\', "payed_at" timestamptz(0) null default null, "company_id" bigint null default null, "expense_id" bigint null default null, constraint "expense_item_pkey" primary key ("id"));');

    this.addSql('create table "expense_item_attachments" ("expense_item_id" bigint not null, "file_upload_id" bigint not null, constraint "expense_item_attachments_pkey" primary key ("expense_item_id", "file_upload_id"));');

    this.addSql('create table "actor_image" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "actor_id" bigint not null, "image_id" bigint not null, "type" text check ("type" in (\'Avatar\', \'AvatarDarkMode\', \'Banner\', \'Profile\')) not null, "last_active_date" timestamptz(0) null default null, constraint "actor_image_pkey" primary key ("id"));');
    this.addSql('alter table "actor_image" add constraint "actor_image_image_id_unique" unique ("image_id");');

    this.addSql('create table "actor_tags" ("actor_id" bigint not null, "tag_id" bigint not null, constraint "actor_tags_pkey" primary key ("actor_id", "tag_id"));');

    this.addSql('create table "account" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'Cash\', \'Primary\', \'Secondary\')) not null default \'Primary\', "name" text not null, "balance" real not null default 0, "bank_info_id" bigint null, "team_id" bigint not null, constraint "account_pkey" primary key ("id"));');

    this.addSql('create table "finance" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "description" text not null default \'\', "amount" real not null, "is_online" boolean not null default false, "method" text check ("method" in (\'Cash\', \'Check\', \'DirectDebit\', \'Transfer\', \'CreditCard\', \'MobilePayment\', \'Other\')) not null, "state" text check ("state" in (\'Canceled\', \'Ongoing\', \'Completed\')) not null default \'Completed\', "category" text check ("category" in (\'Entertainment\', \'Equipment\', \'Errands\', \'MemberReimbursement\', \'MembershipFees\', \'Subvention\', \'Marketing\', \'Subscriptions\', \'Transportation\', \'Other\', \'Unknown\')) not null, "payed_by_type" text check ("payed_by_type" in (\'Automatic\', \'Unknown\', \'Outsider\', \'Manual\')) not null default \'Manual\', "payed_by_id" bigint null default null, "payed_at" timestamptz(0) not null, "received_by_id" bigint not null, "team_id" bigint not null, "account_id" bigint not null, "expense_id" bigint null default null, "event_id" bigint null default null, "location_id" bigint null default null, "project_id" bigint null default null, constraint "finance_pkey" primary key ("id"));');
    this.addSql('alter table "finance" add constraint "finance_expense_id_unique" unique ("expense_id");');

    this.addSql('create table "grant_allocate" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "asked_amount" real not null, "received_amount" real null default null, "state" text check ("state" in (\'Canceled\', \'Ongoing\', \'Completed\')) not null default \'Completed\', "received_amount_processed_by_id" bigint null default null, "received_amount_processed_at" timestamptz(0) null default null, "grant_id" bigint not null, "finance_id" bigint null default null, "signature_id" bigint null default null, "generated_document_id" bigint null default null, constraint "grant_allocate_pkey" primary key ("id"));');

    this.addSql('create table "grant_allocate_attachments" ("grant_allocate_id" bigint not null, "file_upload_id" bigint not null, constraint "grant_allocate_attachments_pkey" primary key ("grant_allocate_id", "file_upload_id"));');

    this.addSql('create table "finance_tags" ("finance_id" bigint not null, "tag_id" bigint not null, constraint "finance_tags_pkey" primary key ("finance_id", "tag_id"));');

    this.addSql('create table "finance_attachments" ("finance_id" bigint not null, "file_upload_id" bigint not null, constraint "finance_attachments_pkey" primary key ("finance_id", "file_upload_id"));');

    this.addSql('create table "account_allocate" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "balance" real not null default 0, "account_id" bigint not null, "team_id" bigint not null, constraint "account_allocate_pkey" primary key ("id"));');

    this.addSql('create table "event_join" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "state" text check ("state" in (\'Approved\', \'Rejected\', \'Canceled\', \'Pending\')) not null default \'Pending\', "is_participant" boolean null default null, "processed_by_id" bigint null default null, "processed_at" timestamptz(0) null default null, "participation_processed_by_id" bigint null default null, "participation_processed_at" timestamptz(0) null default null, "participation_processed_via" text check ("participation_processed_via" in (\'Bot\', \'QR\', \'Manual\', \'Automatic\')) null, "event_id" bigint not null, "joined_by_id" bigint not null, "joined_for_id" bigint null default null, "qr_code_id" bigint null default null, "mission_join_id" bigint null default null, "form_submission_id" bigint null default null, constraint "event_join_pkey" primary key ("id"));');

    this.addSql('create table "mission_join" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "state" text check ("state" in (\'Approved\', \'Rejected\', \'Canceled\', \'Pending\')) not null default \'Pending\', "points" smallint null default null, "processed_by_id" bigint null default null, "processed_at" timestamptz(0) null default null, "points_processed_by_id" bigint null default null, "points_processed_at" timestamptz(0) null default null, "mission_id" bigint not null, "joined_by_id" bigint not null, "event_join_id" bigint null default null, "project_id" bigint null default null, constraint "mission_join_pkey" primary key ("id"));');
    this.addSql('alter table "mission_join" add constraint "mission_join_event_join_id_unique" unique ("event_join_id");');

    this.addSql('create table "class_group_teacher" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "user_id" bigint not null, "class_group_id" bigint not null, "start_date" timestamptz(0) not null, "end_date" timestamptz(0) null default null, constraint "class_group_teacher_pkey" primary key ("id"));');

    this.addSql('create table "class_group_teacher_subjects" ("class_group_teacher_id" bigint not null, "subject_id" bigint not null, constraint "class_group_teacher_subjects_pkey" primary key ("class_group_teacher_id", "subject_id"));');

    this.addSql('create table "action" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "description" text not null default \'\', "points" smallint null default null, "state" text check ("state" in (\'Approved\', \'Rejected\', \'Canceled\', \'Pending\')) not null, "points_processed_by_id" bigint null default null, "points_processed_at" timestamptz(0) null default null, "team_id" bigint not null, "user_id" bigint not null, "event_join_id" bigint null default null, "project_id" bigint null default null, constraint "action_pkey" primary key ("id"));');

    this.addSql('create table "validation" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" varchar(255) not null, "last_active_date" timestamptz(0) null default null, "content_id" bigint null default null, constraint "validation_pkey" primary key ("id"));');

    this.addSql('create table "vote" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "value" smallint not null, "last_active_date" timestamptz(0) null default null, "content_id" bigint null default null, constraint "vote_pkey" primary key ("id"));');

    this.addSql('alter table "user" add constraint "user_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "user" add constraint "user_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "actor" add constraint "actor_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor" add constraint "actor_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "individual" add constraint "individual_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "individual" add constraint "individual_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "individual" add constraint "individual_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade;');
    this.addSql('alter table "individual" add constraint "individual_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "individual" add constraint "individual_bot_id_foreign" foreign key ("bot_id") references "bot" ("id") on update cascade on delete set null;');

    this.addSql('alter table "tenant" add constraint "tenant_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "tenant" add constraint "tenant_event_validation_form_id_foreign" foreign key ("event_validation_form_id") references "form" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_metric" add constraint "team_metric_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_metric" add constraint "team_metric_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "subject" add constraint "subject_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "subject" add constraint "subject_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "social" add constraint "social_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "social" add constraint "social_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "social" add constraint "social_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "shortcut" add constraint "shortcut_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "shortcut" add constraint "shortcut_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "shortcut" add constraint "shortcut_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "shortcut" add constraint "shortcut_target_actor_id_foreign" foreign key ("target_actor_id") references "actor" ("id") on update cascade;');

    this.addSql('alter table "session" add constraint "session_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "session" add constraint "session_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "legal_unit" add constraint "legal_unit_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "legal_unit" add constraint "legal_unit_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade;');
    this.addSql('alter table "legal_unit" add constraint "legal_unit_parent_id_foreign" foreign key ("parent_id") references "legal_unit" ("id") on update cascade on delete set null;');

    this.addSql('alter table "form" add constraint "form_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "form" add constraint "form_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "form_submission" add constraint "form_submission_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "form_submission" add constraint "form_submission_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "form_submission" add constraint "form_submission_form_id_foreign" foreign key ("form_id") references "form" ("id") on update cascade;');

    this.addSql('alter table "file_upload" add constraint "file_upload_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "file_upload" add constraint "file_upload_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "tag" add constraint "tag_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "tag" add constraint "tag_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "tag" add constraint "tag_image_id_foreign" foreign key ("image_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event_approval_step" add constraint "event_approval_step_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_approval_step" add constraint "event_approval_step_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event_approval_step" add constraint "event_approval_step_previous_step_id_foreign" foreign key ("previous_step_id") references "event_approval_step" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event_approval_step_validators" add constraint "event_approval_step_validators_event_approval_step_id_foreign" foreign key ("event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval_step_validators" add constraint "event_approval_step_validators_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event_approval_step_notifiees" add constraint "event_approval_step_notifiees_event_approval_step_id_foreign" foreign key ("event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval_step_notifiees" add constraint "event_approval_step_notifiees_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "cohort" add constraint "cohort_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "cohort" add constraint "cohort_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "class_group" add constraint "class_group_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "class_group" add constraint "class_group_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "subject_class_groups" add constraint "subject_class_groups_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "subject_class_groups" add constraint "subject_class_groups_class_group_id_foreign" foreign key ("class_group_id") references "class_group" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "canteen" add constraint "canteen_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "canteen" add constraint "canteen_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "team" add constraint "team_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team" add constraint "team_join_form_id_foreign" foreign key ("join_form_id") references "form" ("id") on update cascade;');
    this.addSql('alter table "team" add constraint "team_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade;');
    this.addSql('alter table "team" add constraint "team_canteen_id_foreign" foreign key ("canteen_id") references "canteen" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_cohort_id_foreign" foreign key ("cohort_id") references "cohort" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_class_group_id_foreign" foreign key ("class_group_id") references "class_group" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_tenant_grant_fund_id_foreign" foreign key ("tenant_grant_fund_id") references "legal_unit" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_video_id_foreign" foreign key ("video_id") references "file_upload" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_parent_id_foreign" foreign key ("parent_id") references "team" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_member" add constraint "team_member_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_member" add constraint "team_member_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team_member" add constraint "team_member_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "team_member" add constraint "team_member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "team_history" add constraint "team_history_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_history" add constraint "team_history_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team_history" add constraint "team_history_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "role" add constraint "role_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "role" add constraint "role_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "role" add constraint "role_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "team_member_roles" add constraint "team_member_roles_team_member_id_foreign" foreign key ("team_member_id") references "team_member" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_member_roles" add constraint "team_member_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "pole" add constraint "pole_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "pole" add constraint "pole_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "pole" add constraint "pole_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "team_join" add constraint "team_join_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_join" add constraint "team_join_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team_join" add constraint "team_join_joined_by_id_foreign" foreign key ("joined_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "team_join" add constraint "team_join_processed_by_id_foreign" foreign key ("processed_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_join" add constraint "team_join_form_submission_id_foreign" foreign key ("form_submission_id") references "form_submission" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_join" add constraint "team_join_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "team_join" add constraint "team_join_asked_role_id_foreign" foreign key ("asked_role_id") references "role" ("id") on update cascade;');
    this.addSql('alter table "team_join" add constraint "team_join_received_role_id_foreign" foreign key ("received_role_id") references "role" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_join" add constraint "team_join_received_pole_id_foreign" foreign key ("received_pole_id") references "pole" ("id") on update cascade on delete set null;');

    this.addSql('alter table "grant" add constraint "grant_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant" add constraint "grant_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "grant" add constraint "grant_received_amount_processed_by_id_foreign" foreign key ("received_amount_processed_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant" add constraint "grant_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "grant" add constraint "grant_signature_id_foreign" foreign key ("signature_id") references "file_upload" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant" add constraint "grant_generated_document_id_foreign" foreign key ("generated_document_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "project" add constraint "project_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "project" add constraint "project_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "project" add constraint "project_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "project" add constraint "project_banner_id_foreign" foreign key ("banner_id") references "file_upload" ("id") on update cascade on delete set null;');
    this.addSql('alter table "project" add constraint "project_grant_id_foreign" foreign key ("grant_id") references "grant" ("id") on update cascade on delete set null;');

    this.addSql('alter table "project_tags" add constraint "project_tags_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "project_tags" add constraint "project_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "project_supervisors" add constraint "project_supervisors_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "project_supervisors" add constraint "project_supervisors_team_member_id_foreign" foreign key ("team_member_id") references "team_member" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "grant_attachments" add constraint "grant_attachments_grant_id_foreign" foreign key ("grant_id") references "grant" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "grant_attachments" add constraint "grant_attachments_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "document" add constraint "document_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "document" add constraint "document_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "document" add constraint "document_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "document" add constraint "document_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade on delete set null;');
    this.addSql('alter table "document" add constraint "document_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;');

    this.addSql('alter table "content" add constraint "content_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content" add constraint "content_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "content" add constraint "content_parent_id_foreign" foreign key ("parent_id") references "content" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content" add constraint "content_replying_to_id_foreign" foreign key ("replying_to_id") references "content" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content" add constraint "content_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;');

    this.addSql('alter table "thread" add constraint "thread_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "thread" add constraint "thread_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "thread" add constraint "thread_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "thread_tags" add constraint "thread_tags_thread_id_foreign" foreign key ("thread_id") references "thread" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "thread_tags" add constraint "thread_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "thread_contributors" add constraint "thread_contributors_thread_id_foreign" foreign key ("thread_id") references "thread" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "thread_contributors" add constraint "thread_contributors_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "report" add constraint "report_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "report" add constraint "report_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "report" add constraint "report_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete set null;');
    this.addSql('alter table "report" add constraint "report_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "reaction" add constraint "reaction_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "reaction" add constraint "reaction_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "reaction" add constraint "reaction_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "issue" add constraint "issue_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "issue" add constraint "issue_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "issue" add constraint "issue_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "issue_tags" add constraint "issue_tags_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "issue_tags" add constraint "issue_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "issue_contributors" add constraint "issue_contributors_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "issue_contributors" add constraint "issue_contributors_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content_attachments" add constraint "content_attachments_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_attachments" add constraint "content_attachments_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "canteen_menu" add constraint "canteen_menu_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "canteen_menu" add constraint "canteen_menu_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "canteen_menu" add constraint "canteen_menu_canteen_id_foreign" foreign key ("canteen_id") references "canteen" ("id") on update cascade;');

    this.addSql('alter table "canteen_food" add constraint "canteen_food_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "canteen_food" add constraint "canteen_food_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "canteen_food" add constraint "canteen_food_canteen_id_foreign" foreign key ("canteen_id") references "canteen" ("id") on update cascade;');

    this.addSql('alter table "campus_cluster" add constraint "campus_cluster_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "campus_cluster" add constraint "campus_cluster_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "tenant_manage" add constraint "tenant_manage_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "tenant_manage" add constraint "tenant_manage_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "tenant_manage" add constraint "tenant_manage_campus_cluster_id_foreign" foreign key ("campus_cluster_id") references "campus_cluster" ("id") on update cascade on delete set null;');
    this.addSql('alter table "tenant_manage" add constraint "tenant_manage_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "admin_role" add constraint "admin_role_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "admin_role" add constraint "admin_role_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "admin_role" add constraint "admin_role_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade on delete set null;');

    this.addSql('alter table "address" add constraint "address_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');

    this.addSql('alter table "location" add constraint "location_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "location" add constraint "location_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "location" add constraint "location_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade;');
    this.addSql('alter table "location" add constraint "location_address_id_foreign" foreign key ("address_id") references "address" ("id") on update cascade on delete set null;');

    this.addSql('alter table "location_images" add constraint "location_images_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "location_images" add constraint "location_images_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "legal_unit_location" add constraint "legal_unit_location_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "legal_unit_location" add constraint "legal_unit_location_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade;');
    this.addSql('alter table "legal_unit_location" add constraint "legal_unit_location_legal_unit_id_foreign" foreign key ("legal_unit_id") references "legal_unit" ("id") on update cascade on delete set null;');
    this.addSql('alter table "legal_unit_location" add constraint "legal_unit_location_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event" add constraint "event_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event" add constraint "event_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "event" add constraint "event_event_approval_submission_id_foreign" foreign key ("event_approval_submission_id") references "form_submission" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_banner_id_foreign" foreign key ("banner_id") references "file_upload" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event" add constraint "event_join_form_id_foreign" foreign key ("join_form_id") references "form" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_last_event_approval_step_id_foreign" foreign key ("last_event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete set null;');

    this.addSql('alter table "log" add constraint "log_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "log" add constraint "log_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;');
    this.addSql('alter table "log" add constraint "log_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete set null;');
    this.addSql('alter table "log" add constraint "log_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "log" add constraint "log_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event_manage" add constraint "event_manage_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_manage" add constraint "event_manage_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event_manage" add constraint "event_manage_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;');
    this.addSql('alter table "event_manage" add constraint "event_manage_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "mission" add constraint "mission_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "mission" add constraint "mission_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "mission" add constraint "mission_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "mission" add constraint "mission_event_manage_id_foreign" foreign key ("event_manage_id") references "event_manage" ("id") on update cascade on delete set null;');
    this.addSql('alter table "mission" add constraint "mission_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event_manage_supervisors" add constraint "event_manage_supervisors_event_manage_id_foreign" foreign key ("event_manage_id") references "event_manage" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_manage_supervisors" add constraint "event_manage_supervisors_team_member_id_foreign" foreign key ("team_member_id") references "team_member" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event_approval" add constraint "event_approval_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_approval" add constraint "event_approval_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event_approval" add constraint "event_approval_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval" add constraint "event_approval_event_approval_step_id_foreign" foreign key ("event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event_tags" add constraint "event_tags_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_tags" add constraint "event_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "campus" add constraint "campus_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "campus" add constraint "campus_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "campus" add constraint "campus_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade;');
    this.addSql('alter table "campus" add constraint "campus_campus_cluster_id_foreign" foreign key ("campus_cluster_id") references "campus_cluster" ("id") on update cascade;');

    this.addSql('alter table "follow" add constraint "follow_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "follow" add constraint "follow_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "follow" add constraint "follow_followed_actor_id_foreign" foreign key ("followed_actor_id") references "actor" ("id") on update cascade;');

    this.addSql('alter table "favorite" add constraint "favorite_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "favorite" add constraint "favorite_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "favorite" add constraint "favorite_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');
    this.addSql('alter table "favorite" add constraint "favorite_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete set null;');

    this.addSql('alter table "bot" add constraint "bot_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "bot" add constraint "bot_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "bot" add constraint "bot_owner_id_foreign" foreign key ("owner_id") references "actor" ("id") on update cascade;');

    this.addSql('alter table "bank_info" add constraint "bank_info_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "bank_info" add constraint "bank_info_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "bank_info" add constraint "bank_info_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade;');
    this.addSql('alter table "bank_info" add constraint "bank_info_bank_id_foreign" foreign key ("bank_id") references "legal_unit_location" ("id") on update cascade on delete set null;');

    this.addSql('alter table "expense" add constraint "expense_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "expense" add constraint "expense_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "expense" add constraint "expense_processed_by_id_foreign" foreign key ("processed_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "expense" add constraint "expense_expense_report_id_foreign" foreign key ("expense_report_id") references "file_upload" ("id") on update cascade;');
    this.addSql('alter table "expense" add constraint "expense_bank_info_id_foreign" foreign key ("bank_info_id") references "bank_info" ("id") on update cascade;');

    this.addSql('alter table "expense_item" add constraint "expense_item_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "expense_item" add constraint "expense_item_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "expense_item" add constraint "expense_item_company_id_foreign" foreign key ("company_id") references "legal_unit" ("id") on update cascade on delete set null;');
    this.addSql('alter table "expense_item" add constraint "expense_item_expense_id_foreign" foreign key ("expense_id") references "expense" ("id") on update cascade on delete set null;');

    this.addSql('alter table "expense_item_attachments" add constraint "expense_item_attachments_expense_item_id_foreign" foreign key ("expense_item_id") references "expense_item" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "expense_item_attachments" add constraint "expense_item_attachments_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "actor_image" add constraint "actor_image_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor_image" add constraint "actor_image_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "actor_image" add constraint "actor_image_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "actor_image" add constraint "actor_image_image_id_foreign" foreign key ("image_id") references "file_upload" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "actor_tags" add constraint "actor_tags_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "actor_tags" add constraint "actor_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "account" add constraint "account_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "account" add constraint "account_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "account" add constraint "account_bank_info_id_foreign" foreign key ("bank_info_id") references "bank_info" ("id") on update cascade on delete set null;');
    this.addSql('alter table "account" add constraint "account_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "finance" add constraint "finance_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "finance" add constraint "finance_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "finance" add constraint "finance_payed_by_id_foreign" foreign key ("payed_by_id") references "actor" ("id") on update cascade on delete set null;');
    this.addSql('alter table "finance" add constraint "finance_received_by_id_foreign" foreign key ("received_by_id") references "actor" ("id") on update cascade;');
    this.addSql('alter table "finance" add constraint "finance_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "finance" add constraint "finance_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;');
    this.addSql('alter table "finance" add constraint "finance_expense_id_foreign" foreign key ("expense_id") references "expense" ("id") on update cascade on delete set null;');
    this.addSql('alter table "finance" add constraint "finance_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete set null;');
    this.addSql('alter table "finance" add constraint "finance_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete set null;');
    this.addSql('alter table "finance" add constraint "finance_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;');

    this.addSql('alter table "grant_allocate" add constraint "grant_allocate_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant_allocate" add constraint "grant_allocate_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "grant_allocate" add constraint "grant_allocate_received_amount_processed_by_id_foreign" foreign key ("received_amount_processed_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant_allocate" add constraint "grant_allocate_grant_id_foreign" foreign key ("grant_id") references "grant" ("id") on update cascade;');
    this.addSql('alter table "grant_allocate" add constraint "grant_allocate_finance_id_foreign" foreign key ("finance_id") references "finance" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant_allocate" add constraint "grant_allocate_signature_id_foreign" foreign key ("signature_id") references "file_upload" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant_allocate" add constraint "grant_allocate_generated_document_id_foreign" foreign key ("generated_document_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "grant_allocate_attachments" add constraint "grant_allocate_attachments_grant_allocate_id_foreign" foreign key ("grant_allocate_id") references "grant_allocate" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "grant_allocate_attachments" add constraint "grant_allocate_attachments_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "finance_tags" add constraint "finance_tags_finance_id_foreign" foreign key ("finance_id") references "finance" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "finance_tags" add constraint "finance_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "finance_attachments" add constraint "finance_attachments_finance_id_foreign" foreign key ("finance_id") references "finance" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "finance_attachments" add constraint "finance_attachments_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "account_allocate" add constraint "account_allocate_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "account_allocate" add constraint "account_allocate_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "account_allocate" add constraint "account_allocate_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;');
    this.addSql('alter table "account_allocate" add constraint "account_allocate_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "event_join" add constraint "event_join_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_join" add constraint "event_join_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event_join" add constraint "event_join_processed_by_id_foreign" foreign key ("processed_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_join" add constraint "event_join_participation_processed_by_id_foreign" foreign key ("participation_processed_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_join" add constraint "event_join_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;');
    this.addSql('alter table "event_join" add constraint "event_join_joined_by_id_foreign" foreign key ("joined_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "event_join" add constraint "event_join_joined_for_id_foreign" foreign key ("joined_for_id") references "event_manage" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_join" add constraint "event_join_qr_code_id_foreign" foreign key ("qr_code_id") references "file_upload" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_join" add constraint "event_join_mission_join_id_foreign" foreign key ("mission_join_id") references "mission_join" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_join" add constraint "event_join_form_submission_id_foreign" foreign key ("form_submission_id") references "form_submission" ("id") on update cascade on delete set null;');

    this.addSql('alter table "mission_join" add constraint "mission_join_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "mission_join" add constraint "mission_join_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "mission_join" add constraint "mission_join_processed_by_id_foreign" foreign key ("processed_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "mission_join" add constraint "mission_join_points_processed_by_id_foreign" foreign key ("points_processed_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "mission_join" add constraint "mission_join_mission_id_foreign" foreign key ("mission_id") references "mission" ("id") on update cascade;');
    this.addSql('alter table "mission_join" add constraint "mission_join_joined_by_id_foreign" foreign key ("joined_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "mission_join" add constraint "mission_join_event_join_id_foreign" foreign key ("event_join_id") references "event_join" ("id") on update cascade on delete set null;');
    this.addSql('alter table "mission_join" add constraint "mission_join_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;');

    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_class_group_id_foreign" foreign key ("class_group_id") references "class_group" ("id") on update cascade;');

    this.addSql('alter table "class_group_teacher_subjects" add constraint "class_group_teacher_subjects_class_group_teacher_id_foreign" foreign key ("class_group_teacher_id") references "class_group_teacher" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "class_group_teacher_subjects" add constraint "class_group_teacher_subjects_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "action" add constraint "action_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "action" add constraint "action_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "action" add constraint "action_points_processed_by_id_foreign" foreign key ("points_processed_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "action" add constraint "action_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "action" add constraint "action_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "action" add constraint "action_event_join_id_foreign" foreign key ("event_join_id") references "event_join" ("id") on update cascade on delete set null;');
    this.addSql('alter table "action" add constraint "action_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;');

    this.addSql('alter table "validation" add constraint "validation_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "validation" add constraint "validation_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "validation" add constraint "validation_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "vote" add constraint "vote_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "vote" add constraint "vote_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "vote" add constraint "vote_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "individual" drop constraint "individual_user_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_user_id_foreign";');

    this.addSql('alter table "shortcut" drop constraint "shortcut_user_id_foreign";');

    this.addSql('alter table "session" drop constraint "session_user_id_foreign";');

    this.addSql('alter table "team_member" drop constraint "team_member_user_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_joined_by_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_joined_by_id_foreign";');

    this.addSql('alter table "mission_join" drop constraint "mission_join_joined_by_id_foreign";');

    this.addSql('alter table "class_group_teacher" drop constraint "class_group_teacher_user_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_user_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_actor_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_actor_id_foreign";');

    this.addSql('alter table "social" drop constraint "social_actor_id_foreign";');

    this.addSql('alter table "shortcut" drop constraint "shortcut_target_actor_id_foreign";');

    this.addSql('alter table "legal_unit" drop constraint "legal_unit_actor_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_actor_id_foreign";');

    this.addSql('alter table "report" drop constraint "report_actor_id_foreign";');

    this.addSql('alter table "location" drop constraint "location_actor_id_foreign";');

    this.addSql('alter table "legal_unit_location" drop constraint "legal_unit_location_actor_id_foreign";');

    this.addSql('alter table "follow" drop constraint "follow_followed_actor_id_foreign";');

    this.addSql('alter table "favorite" drop constraint "favorite_actor_id_foreign";');

    this.addSql('alter table "bot" drop constraint "bot_owner_id_foreign";');

    this.addSql('alter table "bank_info" drop constraint "bank_info_actor_id_foreign";');

    this.addSql('alter table "actor_image" drop constraint "actor_image_actor_id_foreign";');

    this.addSql('alter table "actor_tags" drop constraint "actor_tags_actor_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_payed_by_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_received_by_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_created_by_id_foreign";');

    this.addSql('alter table "actor" drop constraint "actor_created_by_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_created_by_id_foreign";');

    this.addSql('alter table "tenant" drop constraint "tenant_created_by_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_created_by_id_foreign";');

    this.addSql('alter table "team_metric" drop constraint "team_metric_created_by_id_foreign";');

    this.addSql('alter table "subject" drop constraint "subject_created_by_id_foreign";');

    this.addSql('alter table "social" drop constraint "social_created_by_id_foreign";');

    this.addSql('alter table "shortcut" drop constraint "shortcut_created_by_id_foreign";');

    this.addSql('alter table "session" drop constraint "session_created_by_id_foreign";');

    this.addSql('alter table "legal_unit" drop constraint "legal_unit_created_by_id_foreign";');

    this.addSql('alter table "form" drop constraint "form_created_by_id_foreign";');

    this.addSql('alter table "form_submission" drop constraint "form_submission_created_by_id_foreign";');

    this.addSql('alter table "file_upload" drop constraint "file_upload_created_by_id_foreign";');

    this.addSql('alter table "tag" drop constraint "tag_created_by_id_foreign";');

    this.addSql('alter table "event_approval_step" drop constraint "event_approval_step_created_by_id_foreign";');

    this.addSql('alter table "event_approval_step_validators" drop constraint "event_approval_step_validators_individual_id_foreign";');

    this.addSql('alter table "event_approval_step_notifiees" drop constraint "event_approval_step_notifiees_individual_id_foreign";');

    this.addSql('alter table "cohort" drop constraint "cohort_created_by_id_foreign";');

    this.addSql('alter table "class_group" drop constraint "class_group_created_by_id_foreign";');

    this.addSql('alter table "canteen" drop constraint "canteen_created_by_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_created_by_id_foreign";');

    this.addSql('alter table "team_member" drop constraint "team_member_created_by_id_foreign";');

    this.addSql('alter table "team_history" drop constraint "team_history_created_by_id_foreign";');

    this.addSql('alter table "role" drop constraint "role_created_by_id_foreign";');

    this.addSql('alter table "pole" drop constraint "pole_created_by_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_created_by_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_processed_by_id_foreign";');

    this.addSql('alter table "grant" drop constraint "grant_created_by_id_foreign";');

    this.addSql('alter table "grant" drop constraint "grant_received_amount_processed_by_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_created_by_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_created_by_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_created_by_id_foreign";');

    this.addSql('alter table "thread" drop constraint "thread_created_by_id_foreign";');

    this.addSql('alter table "thread_contributors" drop constraint "thread_contributors_individual_id_foreign";');

    this.addSql('alter table "report" drop constraint "report_created_by_id_foreign";');

    this.addSql('alter table "reaction" drop constraint "reaction_created_by_id_foreign";');

    this.addSql('alter table "issue" drop constraint "issue_created_by_id_foreign";');

    this.addSql('alter table "issue_contributors" drop constraint "issue_contributors_individual_id_foreign";');

    this.addSql('alter table "canteen_menu" drop constraint "canteen_menu_created_by_id_foreign";');

    this.addSql('alter table "canteen_food" drop constraint "canteen_food_created_by_id_foreign";');

    this.addSql('alter table "campus_cluster" drop constraint "campus_cluster_created_by_id_foreign";');

    this.addSql('alter table "tenant_manage" drop constraint "tenant_manage_created_by_id_foreign";');

    this.addSql('alter table "admin_role" drop constraint "admin_role_created_by_id_foreign";');

    this.addSql('alter table "admin_role" drop constraint "admin_role_individual_id_foreign";');

    this.addSql('alter table "address" drop constraint "address_created_by_id_foreign";');

    this.addSql('alter table "location" drop constraint "location_created_by_id_foreign";');

    this.addSql('alter table "legal_unit_location" drop constraint "legal_unit_location_created_by_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_created_by_id_foreign";');

    this.addSql('alter table "log" drop constraint "log_created_by_id_foreign";');

    this.addSql('alter table "log" drop constraint "log_individual_id_foreign";');

    this.addSql('alter table "event_manage" drop constraint "event_manage_created_by_id_foreign";');

    this.addSql('alter table "mission" drop constraint "mission_created_by_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_created_by_id_foreign";');

    this.addSql('alter table "campus" drop constraint "campus_created_by_id_foreign";');

    this.addSql('alter table "follow" drop constraint "follow_created_by_id_foreign";');

    this.addSql('alter table "favorite" drop constraint "favorite_created_by_id_foreign";');

    this.addSql('alter table "bot" drop constraint "bot_created_by_id_foreign";');

    this.addSql('alter table "bank_info" drop constraint "bank_info_created_by_id_foreign";');

    this.addSql('alter table "expense" drop constraint "expense_created_by_id_foreign";');

    this.addSql('alter table "expense" drop constraint "expense_processed_by_id_foreign";');

    this.addSql('alter table "expense_item" drop constraint "expense_item_created_by_id_foreign";');

    this.addSql('alter table "actor_image" drop constraint "actor_image_created_by_id_foreign";');

    this.addSql('alter table "account" drop constraint "account_created_by_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_created_by_id_foreign";');

    this.addSql('alter table "grant_allocate" drop constraint "grant_allocate_created_by_id_foreign";');

    this.addSql('alter table "grant_allocate" drop constraint "grant_allocate_received_amount_processed_by_id_foreign";');

    this.addSql('alter table "account_allocate" drop constraint "account_allocate_created_by_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_created_by_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_processed_by_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_participation_processed_by_id_foreign";');

    this.addSql('alter table "mission_join" drop constraint "mission_join_created_by_id_foreign";');

    this.addSql('alter table "mission_join" drop constraint "mission_join_processed_by_id_foreign";');

    this.addSql('alter table "mission_join" drop constraint "mission_join_points_processed_by_id_foreign";');

    this.addSql('alter table "class_group_teacher" drop constraint "class_group_teacher_created_by_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_created_by_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_points_processed_by_id_foreign";');

    this.addSql('alter table "validation" drop constraint "validation_created_by_id_foreign";');

    this.addSql('alter table "vote" drop constraint "vote_created_by_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_tenant_id_foreign";');

    this.addSql('alter table "actor" drop constraint "actor_tenant_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_tenant_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_tenant_id_foreign";');

    this.addSql('alter table "team_metric" drop constraint "team_metric_tenant_id_foreign";');

    this.addSql('alter table "subject" drop constraint "subject_tenant_id_foreign";');

    this.addSql('alter table "social" drop constraint "social_tenant_id_foreign";');

    this.addSql('alter table "shortcut" drop constraint "shortcut_tenant_id_foreign";');

    this.addSql('alter table "session" drop constraint "session_tenant_id_foreign";');

    this.addSql('alter table "form" drop constraint "form_tenant_id_foreign";');

    this.addSql('alter table "form_submission" drop constraint "form_submission_tenant_id_foreign";');

    this.addSql('alter table "file_upload" drop constraint "file_upload_tenant_id_foreign";');

    this.addSql('alter table "tag" drop constraint "tag_tenant_id_foreign";');

    this.addSql('alter table "event_approval_step" drop constraint "event_approval_step_tenant_id_foreign";');

    this.addSql('alter table "cohort" drop constraint "cohort_tenant_id_foreign";');

    this.addSql('alter table "class_group" drop constraint "class_group_tenant_id_foreign";');

    this.addSql('alter table "canteen" drop constraint "canteen_tenant_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_tenant_id_foreign";');

    this.addSql('alter table "team_member" drop constraint "team_member_tenant_id_foreign";');

    this.addSql('alter table "team_history" drop constraint "team_history_tenant_id_foreign";');

    this.addSql('alter table "role" drop constraint "role_tenant_id_foreign";');

    this.addSql('alter table "pole" drop constraint "pole_tenant_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_tenant_id_foreign";');

    this.addSql('alter table "grant" drop constraint "grant_tenant_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_tenant_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_tenant_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_tenant_id_foreign";');

    this.addSql('alter table "thread" drop constraint "thread_tenant_id_foreign";');

    this.addSql('alter table "report" drop constraint "report_tenant_id_foreign";');

    this.addSql('alter table "reaction" drop constraint "reaction_tenant_id_foreign";');

    this.addSql('alter table "issue" drop constraint "issue_tenant_id_foreign";');

    this.addSql('alter table "canteen_menu" drop constraint "canteen_menu_tenant_id_foreign";');

    this.addSql('alter table "canteen_food" drop constraint "canteen_food_tenant_id_foreign";');

    this.addSql('alter table "campus_cluster" drop constraint "campus_cluster_tenant_id_foreign";');

    this.addSql('alter table "tenant_manage" drop constraint "tenant_manage_tenant_id_foreign";');

    this.addSql('alter table "admin_role" drop constraint "admin_role_tenant_id_foreign";');

    this.addSql('alter table "location" drop constraint "location_tenant_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_tenant_id_foreign";');

    this.addSql('alter table "log" drop constraint "log_tenant_id_foreign";');

    this.addSql('alter table "event_manage" drop constraint "event_manage_tenant_id_foreign";');

    this.addSql('alter table "mission" drop constraint "mission_tenant_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_tenant_id_foreign";');

    this.addSql('alter table "campus" drop constraint "campus_tenant_id_foreign";');

    this.addSql('alter table "follow" drop constraint "follow_tenant_id_foreign";');

    this.addSql('alter table "favorite" drop constraint "favorite_tenant_id_foreign";');

    this.addSql('alter table "bot" drop constraint "bot_tenant_id_foreign";');

    this.addSql('alter table "bank_info" drop constraint "bank_info_tenant_id_foreign";');

    this.addSql('alter table "expense" drop constraint "expense_tenant_id_foreign";');

    this.addSql('alter table "expense_item" drop constraint "expense_item_tenant_id_foreign";');

    this.addSql('alter table "actor_image" drop constraint "actor_image_tenant_id_foreign";');

    this.addSql('alter table "account" drop constraint "account_tenant_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_tenant_id_foreign";');

    this.addSql('alter table "grant_allocate" drop constraint "grant_allocate_tenant_id_foreign";');

    this.addSql('alter table "account_allocate" drop constraint "account_allocate_tenant_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_tenant_id_foreign";');

    this.addSql('alter table "mission_join" drop constraint "mission_join_tenant_id_foreign";');

    this.addSql('alter table "class_group_teacher" drop constraint "class_group_teacher_tenant_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_tenant_id_foreign";');

    this.addSql('alter table "validation" drop constraint "validation_tenant_id_foreign";');

    this.addSql('alter table "vote" drop constraint "vote_tenant_id_foreign";');

    this.addSql('alter table "subject_class_groups" drop constraint "subject_class_groups_subject_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_subject_id_foreign";');

    this.addSql('alter table "class_group_teacher_subjects" drop constraint "class_group_teacher_subjects_subject_id_foreign";');

    this.addSql('alter table "legal_unit" drop constraint "legal_unit_parent_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_tenant_grant_fund_id_foreign";');

    this.addSql('alter table "legal_unit_location" drop constraint "legal_unit_location_legal_unit_id_foreign";');

    this.addSql('alter table "expense_item" drop constraint "expense_item_company_id_foreign";');

    this.addSql('alter table "tenant" drop constraint "tenant_event_validation_form_id_foreign";');

    this.addSql('alter table "form_submission" drop constraint "form_submission_form_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_join_form_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_join_form_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_form_submission_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_event_approval_submission_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_form_submission_id_foreign";');

    this.addSql('alter table "tag" drop constraint "tag_image_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_video_id_foreign";');

    this.addSql('alter table "grant" drop constraint "grant_signature_id_foreign";');

    this.addSql('alter table "grant" drop constraint "grant_generated_document_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_banner_id_foreign";');

    this.addSql('alter table "grant_attachments" drop constraint "grant_attachments_file_upload_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_file_id_foreign";');

    this.addSql('alter table "content_attachments" drop constraint "content_attachments_file_upload_id_foreign";');

    this.addSql('alter table "location_images" drop constraint "location_images_file_upload_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_banner_id_foreign";');

    this.addSql('alter table "expense" drop constraint "expense_expense_report_id_foreign";');

    this.addSql('alter table "expense_item_attachments" drop constraint "expense_item_attachments_file_upload_id_foreign";');

    this.addSql('alter table "actor_image" drop constraint "actor_image_image_id_foreign";');

    this.addSql('alter table "grant_allocate" drop constraint "grant_allocate_signature_id_foreign";');

    this.addSql('alter table "grant_allocate" drop constraint "grant_allocate_generated_document_id_foreign";');

    this.addSql('alter table "grant_allocate_attachments" drop constraint "grant_allocate_attachments_file_upload_id_foreign";');

    this.addSql('alter table "finance_attachments" drop constraint "finance_attachments_file_upload_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_qr_code_id_foreign";');

    this.addSql('alter table "project_tags" drop constraint "project_tags_tag_id_foreign";');

    this.addSql('alter table "thread_tags" drop constraint "thread_tags_tag_id_foreign";');

    this.addSql('alter table "issue_tags" drop constraint "issue_tags_tag_id_foreign";');

    this.addSql('alter table "event_tags" drop constraint "event_tags_tag_id_foreign";');

    this.addSql('alter table "actor_tags" drop constraint "actor_tags_tag_id_foreign";');

    this.addSql('alter table "finance_tags" drop constraint "finance_tags_tag_id_foreign";');

    this.addSql('alter table "event_approval_step" drop constraint "event_approval_step_previous_step_id_foreign";');

    this.addSql('alter table "event_approval_step_validators" drop constraint "event_approval_step_validators_event_approval_step_id_foreign";');

    this.addSql('alter table "event_approval_step_notifiees" drop constraint "event_approval_step_notifiees_event_approval_step_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_last_event_approval_step_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_event_approval_step_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_cohort_id_foreign";');

    this.addSql('alter table "subject_class_groups" drop constraint "subject_class_groups_class_group_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_class_group_id_foreign";');

    this.addSql('alter table "class_group_teacher" drop constraint "class_group_teacher_class_group_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_canteen_id_foreign";');

    this.addSql('alter table "canteen_menu" drop constraint "canteen_menu_canteen_id_foreign";');

    this.addSql('alter table "canteen_food" drop constraint "canteen_food_canteen_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_parent_id_foreign";');

    this.addSql('alter table "team_member" drop constraint "team_member_team_id_foreign";');

    this.addSql('alter table "team_history" drop constraint "team_history_team_id_foreign";');

    this.addSql('alter table "role" drop constraint "role_team_id_foreign";');

    this.addSql('alter table "pole" drop constraint "pole_team_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_team_id_foreign";');

    this.addSql('alter table "grant" drop constraint "grant_team_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_team_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_team_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_team_id_foreign";');

    this.addSql('alter table "tenant_manage" drop constraint "tenant_manage_team_id_foreign";');

    this.addSql('alter table "log" drop constraint "log_team_id_foreign";');

    this.addSql('alter table "event_manage" drop constraint "event_manage_team_id_foreign";');

    this.addSql('alter table "mission" drop constraint "mission_team_id_foreign";');

    this.addSql('alter table "account" drop constraint "account_team_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_team_id_foreign";');

    this.addSql('alter table "account_allocate" drop constraint "account_allocate_team_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_team_id_foreign";');

    this.addSql('alter table "team_member_roles" drop constraint "team_member_roles_team_member_id_foreign";');

    this.addSql('alter table "project_supervisors" drop constraint "project_supervisors_team_member_id_foreign";');

    this.addSql('alter table "event_manage_supervisors" drop constraint "event_manage_supervisors_team_member_id_foreign";');

    this.addSql('alter table "team_member_roles" drop constraint "team_member_roles_role_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_asked_role_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_received_role_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_received_pole_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_grant_id_foreign";');

    this.addSql('alter table "grant_attachments" drop constraint "grant_attachments_grant_id_foreign";');

    this.addSql('alter table "grant_allocate" drop constraint "grant_allocate_grant_id_foreign";');

    this.addSql('alter table "project_tags" drop constraint "project_tags_project_id_foreign";');

    this.addSql('alter table "project_supervisors" drop constraint "project_supervisors_project_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_project_id_foreign";');

    this.addSql('alter table "mission" drop constraint "mission_project_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_project_id_foreign";');

    this.addSql('alter table "mission_join" drop constraint "mission_join_project_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_project_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_parent_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_replying_to_id_foreign";');

    this.addSql('alter table "thread" drop constraint "thread_content_id_foreign";');

    this.addSql('alter table "report" drop constraint "report_content_id_foreign";');

    this.addSql('alter table "reaction" drop constraint "reaction_content_id_foreign";');

    this.addSql('alter table "issue" drop constraint "issue_content_id_foreign";');

    this.addSql('alter table "content_attachments" drop constraint "content_attachments_content_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_content_id_foreign";');

    this.addSql('alter table "favorite" drop constraint "favorite_content_id_foreign";');

    this.addSql('alter table "validation" drop constraint "validation_content_id_foreign";');

    this.addSql('alter table "vote" drop constraint "vote_content_id_foreign";');

    this.addSql('alter table "thread_tags" drop constraint "thread_tags_thread_id_foreign";');

    this.addSql('alter table "thread_contributors" drop constraint "thread_contributors_thread_id_foreign";');

    this.addSql('alter table "issue_tags" drop constraint "issue_tags_issue_id_foreign";');

    this.addSql('alter table "issue_contributors" drop constraint "issue_contributors_issue_id_foreign";');

    this.addSql('alter table "tenant_manage" drop constraint "tenant_manage_campus_cluster_id_foreign";');

    this.addSql('alter table "campus" drop constraint "campus_campus_cluster_id_foreign";');

    this.addSql('alter table "location" drop constraint "location_address_id_foreign";');

    this.addSql('alter table "location_images" drop constraint "location_images_location_id_foreign";');

    this.addSql('alter table "legal_unit_location" drop constraint "legal_unit_location_location_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_location_id_foreign";');

    this.addSql('alter table "campus" drop constraint "campus_location_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_location_id_foreign";');

    this.addSql('alter table "bank_info" drop constraint "bank_info_bank_id_foreign";');

    this.addSql('alter table "log" drop constraint "log_event_id_foreign";');

    this.addSql('alter table "event_manage" drop constraint "event_manage_event_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_event_id_foreign";');

    this.addSql('alter table "event_tags" drop constraint "event_tags_event_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_event_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_event_id_foreign";');

    this.addSql('alter table "mission" drop constraint "mission_event_manage_id_foreign";');

    this.addSql('alter table "event_manage_supervisors" drop constraint "event_manage_supervisors_event_manage_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_joined_for_id_foreign";');

    this.addSql('alter table "mission_join" drop constraint "mission_join_mission_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_bot_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_bot_id_foreign";');

    this.addSql('alter table "expense" drop constraint "expense_bank_info_id_foreign";');

    this.addSql('alter table "account" drop constraint "account_bank_info_id_foreign";');

    this.addSql('alter table "expense_item" drop constraint "expense_item_expense_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_expense_id_foreign";');

    this.addSql('alter table "expense_item_attachments" drop constraint "expense_item_attachments_expense_item_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_account_id_foreign";');

    this.addSql('alter table "account_allocate" drop constraint "account_allocate_account_id_foreign";');

    this.addSql('alter table "grant_allocate" drop constraint "grant_allocate_finance_id_foreign";');

    this.addSql('alter table "finance_tags" drop constraint "finance_tags_finance_id_foreign";');

    this.addSql('alter table "finance_attachments" drop constraint "finance_attachments_finance_id_foreign";');

    this.addSql('alter table "grant_allocate_attachments" drop constraint "grant_allocate_attachments_grant_allocate_id_foreign";');

    this.addSql('alter table "mission_join" drop constraint "mission_join_event_join_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_event_join_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_mission_join_id_foreign";');

    this.addSql('alter table "class_group_teacher_subjects" drop constraint "class_group_teacher_subjects_class_group_teacher_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "actor" cascade;');

    this.addSql('drop table if exists "individual" cascade;');

    this.addSql('drop table if exists "tenant" cascade;');

    this.addSql('drop table if exists "team_metric" cascade;');

    this.addSql('drop table if exists "subject" cascade;');

    this.addSql('drop table if exists "social" cascade;');

    this.addSql('drop table if exists "shortcut" cascade;');

    this.addSql('drop table if exists "session" cascade;');

    this.addSql('drop table if exists "legal_unit" cascade;');

    this.addSql('drop table if exists "form" cascade;');

    this.addSql('drop table if exists "form_submission" cascade;');

    this.addSql('drop table if exists "file_upload" cascade;');

    this.addSql('drop table if exists "tag" cascade;');

    this.addSql('drop table if exists "event_approval_step" cascade;');

    this.addSql('drop table if exists "event_approval_step_validators" cascade;');

    this.addSql('drop table if exists "event_approval_step_notifiees" cascade;');

    this.addSql('drop table if exists "cohort" cascade;');

    this.addSql('drop table if exists "class_group" cascade;');

    this.addSql('drop table if exists "subject_class_groups" cascade;');

    this.addSql('drop table if exists "canteen" cascade;');

    this.addSql('drop table if exists "team" cascade;');

    this.addSql('drop table if exists "team_member" cascade;');

    this.addSql('drop table if exists "team_history" cascade;');

    this.addSql('drop table if exists "role" cascade;');

    this.addSql('drop table if exists "team_member_roles" cascade;');

    this.addSql('drop table if exists "pole" cascade;');

    this.addSql('drop table if exists "team_join" cascade;');

    this.addSql('drop table if exists "grant" cascade;');

    this.addSql('drop table if exists "project" cascade;');

    this.addSql('drop table if exists "project_tags" cascade;');

    this.addSql('drop table if exists "project_supervisors" cascade;');

    this.addSql('drop table if exists "grant_attachments" cascade;');

    this.addSql('drop table if exists "document" cascade;');

    this.addSql('drop table if exists "content" cascade;');

    this.addSql('drop table if exists "thread" cascade;');

    this.addSql('drop table if exists "thread_tags" cascade;');

    this.addSql('drop table if exists "thread_contributors" cascade;');

    this.addSql('drop table if exists "report" cascade;');

    this.addSql('drop table if exists "reaction" cascade;');

    this.addSql('drop table if exists "issue" cascade;');

    this.addSql('drop table if exists "issue_tags" cascade;');

    this.addSql('drop table if exists "issue_contributors" cascade;');

    this.addSql('drop table if exists "content_attachments" cascade;');

    this.addSql('drop table if exists "canteen_menu" cascade;');

    this.addSql('drop table if exists "canteen_food" cascade;');

    this.addSql('drop table if exists "campus_cluster" cascade;');

    this.addSql('drop table if exists "tenant_manage" cascade;');

    this.addSql('drop table if exists "admin_role" cascade;');

    this.addSql('drop table if exists "address" cascade;');

    this.addSql('drop table if exists "location" cascade;');

    this.addSql('drop table if exists "location_images" cascade;');

    this.addSql('drop table if exists "legal_unit_location" cascade;');

    this.addSql('drop table if exists "event" cascade;');

    this.addSql('drop table if exists "log" cascade;');

    this.addSql('drop table if exists "event_manage" cascade;');

    this.addSql('drop table if exists "mission" cascade;');

    this.addSql('drop table if exists "event_manage_supervisors" cascade;');

    this.addSql('drop table if exists "event_approval" cascade;');

    this.addSql('drop table if exists "event_tags" cascade;');

    this.addSql('drop table if exists "campus" cascade;');

    this.addSql('drop table if exists "follow" cascade;');

    this.addSql('drop table if exists "favorite" cascade;');

    this.addSql('drop table if exists "bot" cascade;');

    this.addSql('drop table if exists "bank_info" cascade;');

    this.addSql('drop table if exists "expense" cascade;');

    this.addSql('drop table if exists "expense_item" cascade;');

    this.addSql('drop table if exists "expense_item_attachments" cascade;');

    this.addSql('drop table if exists "actor_image" cascade;');

    this.addSql('drop table if exists "actor_tags" cascade;');

    this.addSql('drop table if exists "account" cascade;');

    this.addSql('drop table if exists "finance" cascade;');

    this.addSql('drop table if exists "grant_allocate" cascade;');

    this.addSql('drop table if exists "grant_allocate_attachments" cascade;');

    this.addSql('drop table if exists "finance_tags" cascade;');

    this.addSql('drop table if exists "finance_attachments" cascade;');

    this.addSql('drop table if exists "account_allocate" cascade;');

    this.addSql('drop table if exists "event_join" cascade;');

    this.addSql('drop table if exists "mission_join" cascade;');

    this.addSql('drop table if exists "class_group_teacher" cascade;');

    this.addSql('drop table if exists "class_group_teacher_subjects" cascade;');

    this.addSql('drop table if exists "action" cascade;');

    this.addSql('drop table if exists "validation" cascade;');

    this.addSql('drop table if exists "vote" cascade;');
  }

}
