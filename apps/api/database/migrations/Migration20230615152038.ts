import { Migration } from '@mikro-orm/migrations';

export class Migration20230615152038 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_info" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "first_name" text not null, "middle_names" text[] not null, "last_name" text not null, "customization_color" text check ("customization_color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\')) null default null, "customization_signature" text null default null, "stats_points" int not null, "stats_post_count" smallint not null, "stats_last_post_at" timestamptz(0) null default null, "stats_post_streak" smallint not null, "stats_reply_count" smallint not null, "stats_last_reply_at" timestamptz(0) null default null, "stats_reply_streak" smallint not null, "stats_comment_count" smallint not null, "stats_last_comment" timestamptz(0) null default null, "stats_upload_count" smallint not null, "stats_last_action_at" timestamptz(0) null default null, "stats_action_streak" smallint not null, "settings_dark_mode_activated" boolean not null, "settings_gdpr_end_of_life_export" boolean not null, "settings_gdpr_end_of_life_anonymize" boolean not null, "notification_settings_mentionned" smallint not null, "notification_settings_badge_unlocked" smallint not null, "notification_settings_blog_subscribed_updated" smallint not null, "notification_settings_content_removed" smallint not null, "notification_settings_admin_report_created" smallint not null, "notification_settings_event_created" smallint not null, "notification_settings_team_subscribed_event_created" smallint not null, "notification_settings_team_managed_form_updated" smallint not null, "notification_settings_team_managed_event_updated" smallint not null, "notification_settings_team_managed_membership_request_updated" smallint not null, "notification_settings_team_managed_member_role_updated" smallint not null, "notification_settings_admin_team_social_updated" smallint not null, "notification_settings_admin_team_legal_file_updated" smallint not null, "notification_settings_event_subscribed_updated" smallint not null, "notification_settings_event_managed_approved" smallint not null, "notification_settings_event_managed_rejected" smallint not null, "notification_settings_event_managed_registration_created" smallint not null, "notification_settings_admin_event_validation_started" smallint not null, "notification_settings_admin_event_validation_step" smallint not null, "notification_settings_admin_event_validation_approved" smallint not null, "notification_settings_admin_event_validation_rejected" smallint not null, "notification_settings_thread_subscribed_updated" smallint not null, "notification_settings_thread_subscribed_answered" smallint not null, "notification_settings_admin_thread_stale" smallint not null, "notification_settings_admin_thread_stale_threshold" int not null, "notification_settings_admin_thread_assigned_stale" smallint not null, "notification_settings_admin_thread_assigned_stale_threshold" int not null, "notification_settings_admin_thread_assigned" smallint not null, "notification_settings_role_updated" smallint not null, "notification_settings_admin_role_updated" smallint not null, "finished_introduction" boolean not null, "finished_onboarding" boolean not null, constraint "user_info_pkey" primary key ("id"));');

    this.addSql('create table "canteen" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "description" text null default null, constraint "canteen_pkey" primary key ("id"));');

    this.addSql('create table "tenant" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "domain" text not null, "name" text not null, "point_name" text not null, "oidc_info_oidc_enabled" boolean not null, "oidc_info_oidc_name" text null default null, "oidc_info_oidc_client_id" text null default null, "oidc_info_oidc_client_secret" text null default null, "oidc_info_oidc_discovery_url" text null default null, "oidc_info_oidc_scopes" text null default null, "oidc_info_oidc_callback_uri" text null default null, "event_validation_form_id" bigint null default null, "team_id" bigint null default null, constraint "tenant_pkey" primary key ("id"));');
    this.addSql('alter table "tenant" add constraint "tenant_domain_unique" unique ("domain");');
    this.addSql('alter table "tenant" add constraint "tenant_event_validation_form_id_unique" unique ("event_validation_form_id");');
    this.addSql('alter table "tenant" add constraint "tenant_team_id_unique" unique ("team_id");');

    this.addSql('create table "team" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'Association\', \'Canteen\', \'Club\', \'Project\', \'Department\', \'Tenant\')) not null default \'Club\', "original_creation_day" smallint null default null, "original_creation_month" smallint null default null, "original_creation_year" smallint null default null, "membership_fees" int not null, "current_finance" real not null, "directors_category_name" text not null, "managers_category_name" text not null, "members_category_name" text not null, "canteen_id" bigint null default null, "cohort_id" bigint null default null, "class_group_id" bigint null default null, "parent_id" bigint null default null, "video_id" bigint null default null, constraint "team_pkey" primary key ("id"));');
    this.addSql('alter table "team" add constraint "team_canteen_id_unique" unique ("canteen_id");');
    this.addSql('alter table "team" add constraint "team_cohort_id_unique" unique ("cohort_id");');
    this.addSql('alter table "team" add constraint "team_class_group_id_unique" unique ("class_group_id");');

    this.addSql('create table "individual" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "user_id" bigint null, "bot_id" bigint null, "password_hash" text null default null, "scope_role" text check ("scope_role" in (\'tenant_user\', \'tenant_teacher\', \'tenant_admin\', \'admin\')) not null, constraint "individual_pkey" primary key ("id"));');
    this.addSql('alter table "individual" add constraint "individual_user_id_unique" unique ("user_id");');
    this.addSql('alter table "individual" add constraint "individual_bot_id_unique" unique ("bot_id");');

    this.addSql('create table "team_metric" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "value" text not null, "type" text check ("type" in (\'MemberInOrgAndChildrenCount\', \'MemberInOrgAndChildrenUniqueCount\', \'MemberInOrgAndChildrenUniqueCount\', \'EventOccuringCount\', \'EventCreatedCount\', \'EventOccuringCount\', \'EventCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ContentCreatedCount\', \'ContentCreatedCount\', \'ChildOrgCount\')) not null, constraint "team_metric_pkey" primary key ("id"));');

    this.addSql('create table "team_member" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "team_id" bigint not null, "user_id" bigint not null, "permissions" int not null default 0, "start_date" timestamptz(0) not null default CURRENT_TIMESTAMP, "end_date" timestamptz(0) null default null, constraint "team_member_pkey" primary key ("id"));');

    this.addSql('create table "subject" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "english_name" text null default null, "description" text null default null, "code" text not null, "type" text check ("type" in (\'Mathematics\', \'Physics\', \'English\', \'Communication\', \'Programming\')) not null, "last_active_date" timestamptz(0) null default null, constraint "subject_pkey" primary key ("id"));');
    this.addSql('create index "subject_code_index" on "subject" ("code");');

    this.addSql('create table "session" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "ip" varchar(255) not null, "country" varchar(255) not null, "client_type" text check ("client_type" in (\'WebClient\', \'MobileClient\', \'DesktopClient\')) not null, "user_agent" jsonb not null, "refresh_token_hash" varchar(255) not null, "token_family" varchar(255) not null, "user_id" bigint not null, "last_activity_at" timestamptz(0) not null, "last_issued_at" timestamptz(0) not null, "revoked_at" timestamptz(0) null default null, "expired_at" timestamptz(0) null default null, constraint "session_pkey" primary key ("id"));');

    this.addSql('create table "role" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "permissions" int not null default 0, "team_id" bigint not null, "category" text check ("category" in (\'Directors\', \'Managers\', \'Members\')) not null, "type" text check ("type" in (\'Director\', \'Treasurer\', \'Secretary\', \'Member\')) not null default \'Member\', "is_required" boolean not null, constraint "role_pkey" primary key ("id"));');

    this.addSql('create table "team_member_roles" ("team_member_id" bigint not null, "role_id" bigint not null, constraint "team_member_roles_pkey" primary key ("team_member_id", "role_id"));');

    this.addSql('create table "pole" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "team_id" bigint not null, "name" text not null, "description" text not null, "required" boolean not null, "category" text check ("category" in (\'Administration\', \'Communication\', \'Members\', \'Relations\', \'Activity\')) not null, constraint "pole_pkey" primary key ("id"));');

    this.addSql('create table "form" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "team_id" bigint null, "schema" jsonb not null, "type" text check ("type" in (\'Event\', \'Team\', \'Internal\', \'Survey\')) not null, "is_template" boolean not null, "is_enabled" boolean not null, "is_allowing_multiple_answers" boolean not null, "is_allowing_editing_answers" boolean not null, "is_required" boolean not null, constraint "form_pkey" primary key ("id"));');
    this.addSql('alter table "form" add constraint "form_team_id_unique" unique ("team_id");');

    this.addSql('create table "file_upload" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "size" int not null, "mime" text not null, "url" text not null, "file_last_modified_at" timestamptz(0) not null, constraint "file_upload_pkey" primary key ("id"));');

    this.addSql('create table "tag" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'TeamCategory\', \'Tag\')) not null, "name" text not null, "slug" text not null, "description" text not null default \'\', "image_id" bigint null default null, "color" text check ("color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\')) not null, constraint "tag_pkey" primary key ("id"));');

    this.addSql('create table "project" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "description" text null default null, "slug" text not null, "color" text check ("color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\')) not null default \'Blue\', "expected_budget" real not null, "actual_budget" real not null default 0, "is_private" boolean not null, "regular_event_interval" text null default null, "team_id" bigint not null, "image_id" bigint null default null, constraint "project_pkey" primary key ("id"));');

    this.addSql('create table "project_role" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "description" text not null, "auto_accept" boolean not null, "reward_minimum" smallint not null, "reward_maximum" smallint not null, "name" text not null, "color" text check ("color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\')) not null, "required" boolean not null, "project_id" bigint not null, constraint "project_role_pkey" primary key ("id"));');

    this.addSql('create table "project_tags" ("project_id" bigint not null, "tag_id" bigint not null, constraint "project_tags_pkey" primary key ("project_id", "tag_id"));');

    this.addSql('create table "project_supervisors" ("project_id" bigint not null, "team_member_id" bigint not null, constraint "project_supervisors_pkey" primary key ("project_id", "team_member_id"));');

    this.addSql('create table "event_approval_step" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" varchar(255) not null, "description" varchar(255) not null default \'\', "previous_step_id" bigint null default null, constraint "event_approval_step_pkey" primary key ("id"));');

    this.addSql('create table "event_approval_step_validators" ("event_approval_step_id" bigint not null, "individual_id" bigint not null, constraint "event_approval_step_validators_pkey" primary key ("event_approval_step_id", "individual_id"));');

    this.addSql('create table "event_approval_step_notifiees" ("event_approval_step_id" bigint not null, "individual_id" bigint not null, constraint "event_approval_step_notifiees_pkey" primary key ("event_approval_step_id", "individual_id"));');

    this.addSql('create table "content" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "text" text not null, "is_anonymous" boolean not null, "parent_id" bigint null default null, constraint "content_pkey" primary key ("id"));');

    this.addSql('create table "reaction" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "reaction_type" text check ("reaction_type" in (\'What\', \'Interesting\', \'Like\', \'NotAnIssue\', \'Bump\', \'Laugh\', \'Unsure\', \'Partial\', \'Perfect\')) not null, "last_active_date" timestamptz(0) null default null, "content_id" bigint null default null, constraint "reaction_pkey" primary key ("id"));');
    this.addSql('create index "reaction_reaction_type_index" on "reaction" ("reaction_type");');

    this.addSql('create table "content_master" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'Announcement\', \'Issue\', \'Event\', \'Blog\', \'Thread\', \'Wiki\')) not null, "name" text not null, "slug" text not null, "root_content_id" bigint not null, constraint "content_master_pkey" primary key ("id"));');
    this.addSql('alter table "content_master" add constraint "content_master_root_content_id_unique" unique ("root_content_id");');

    this.addSql('create table "log" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "event" text check ("event" in (\'Create\', \'Update\', \'Delete\', \'Hide\')) not null, "context" text check ("context" in (\'User\', \'Bot\', \'CRON\', \'Seeding\', \'System\')) not null, "diff" jsonb not null default \'{}\', "entity_name" text check ("entity_name" in (\'Individual\', \'BotInfo\', \'UserInfo\', \'Tenant\', \'Campus\', \'Actor\', \'ActorBankInfo\', \'ActorAddress\', \'ActorFinance\', \'ActorImage\', \'Social\', \'Tag\', \'Follow\', \'Session\', \'Shortcut\', \'Team\', \'Action\', \'Pole\', \'Role\', \'ChangeRole\', \'Expense\', \'TeamFinance\', \'TeamJoin\', \'TeamMember\', \'TeamMetric\', \'Canteen\', \'CanteenFood\', \'CanteenMenu\', \'ClassGroup\', \'ClassGroupTeacher\', \'Cohort\', \'Project\', \'ProjectRole\', \'Event\', \'EventAttendance\', \'EventJoin\', \'EventRole\', \'EventChangeRole\', \'FileUpload\', \'Favorite\', \'Reaction\', \'Report\', \'Validation\', \'Vote\', \'EventApproval\', \'EventApprovalStep\', \'Content\', \'ContentMaster\', \'Issue\', \'Document\', \'DocumentEdit\', \'Subject\', \'Form\', \'FormEdit\', \'FormSubmission\', \'FormSubmissionEdit\')) not null, "entity_id" bigint not null, "note" text not null default \'\', "team_id" bigint null default null, "content_master_id" bigint null default null, "individual_id" bigint null default null, constraint "log_pkey" primary key ("id"));');

    this.addSql('create table "issue" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "content_master_id" bigint not null, constraint "issue_pkey" primary key ("id"));');
    this.addSql('alter table "issue" add constraint "issue_content_master_id_unique" unique ("content_master_id");');

    this.addSql('create table "content_master_tags" ("content_master_id" bigint not null, "tag_id" bigint not null, constraint "content_master_tags_pkey" primary key ("content_master_id", "tag_id"));');

    this.addSql('create table "content_master_contributors" ("content_master_id" bigint not null, "individual_id" bigint not null, constraint "content_master_contributors_pkey" primary key ("content_master_id", "individual_id"));');

    this.addSql('create table "content_attachments" ("content_id" bigint not null, "file_upload_id" bigint not null, constraint "content_attachments_pkey" primary key ("content_id", "file_upload_id"));');

    this.addSql('create table "cohort" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "year" smallint not null, constraint "cohort_pkey" primary key ("id"));');

    this.addSql('create table "class_group" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "description" text null default null, "type" text check ("type" in (\'All\', \'Program\', \'Year\', \'Sector\', \'Class\')) not null, constraint "class_group_pkey" primary key ("id"));');

    this.addSql('create table "subject_class_groups" ("subject_id" bigint not null, "class_group_id" bigint not null, constraint "subject_class_groups_pkey" primary key ("subject_id", "class_group_id"));');

    this.addSql('create table "form_edit" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "added_diff" jsonb null default null, "form_id" bigint not null, "new_version" jsonb not null, constraint "form_edit_pkey" primary key ("id"));');

    this.addSql('create table "form_submission" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "submission" jsonb not null, "form_edit_id" bigint not null, constraint "form_submission_pkey" primary key ("id"));');

    this.addSql('create table "form_submission_edit" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "added_diff" jsonb null default null, "new_version" jsonb not null, "form_submission_id" bigint not null, constraint "form_submission_edit_pkey" primary key ("id"));');

    this.addSql('create table "document" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "description" text not null, "year_version" smallint null default null, "type" text check ("type" in (\'TenantGuide\', \'AssociationConstitution\', \'AssociationDeclaration\', \'ClubHandover\', \'ClubCharter\', \'TeamMeetingTranscript\', \'TeamGraphicCharter\', \'Other\')) not null, "file_id" bigint null, "subject_id" bigint null default null, "team_id" bigint null default null, constraint "document_pkey" primary key ("id"));');
    this.addSql('alter table "document" add constraint "document_file_id_unique" unique ("file_id");');

    this.addSql('create table "document_edit" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "new_version_id" bigint not null, "document_id" bigint not null, "type" text check ("type" in (\'TenantGuide\', \'AssociationConstitution\', \'AssociationDeclaration\', \'ClubHandover\', \'ClubCharter\', \'TeamMeetingTranscript\', \'TeamGraphicCharter\', \'Other\')) not null, "year_version" smallint null default null, constraint "document_edit_pkey" primary key ("id"));');

    this.addSql('create table "content_teams" ("content_id" bigint not null, "team_id" bigint not null, constraint "content_teams_pkey" primary key ("content_id", "team_id"));');

    this.addSql('create table "canteen_menu" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "canteen_id" bigint not null, constraint "canteen_menu_pkey" primary key ("id"));');

    this.addSql('create table "canteen_food" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "canteen_id" bigint not null, constraint "canteen_food_pkey" primary key ("id"));');

    this.addSql('create table "campus" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, constraint "campus_pkey" primary key ("id"));');

    this.addSql('create table "actor" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "individual_id" bigint null, "team_id" bigint null, "slug" text not null, "name" text not null, "status" text not null default \'\', "bio" text not null default \'\', "email" text not null default \'\', "website" text not null default \'\', "ical" text not null, constraint "actor_pkey" primary key ("id"));');
    this.addSql('alter table "actor" add constraint "actor_individual_id_unique" unique ("individual_id");');
    this.addSql('alter table "actor" add constraint "actor_team_id_unique" unique ("team_id");');
    this.addSql('alter table "actor" add constraint "actor_ical_unique" unique ("ical");');

    this.addSql('create table "social" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "actor_id" bigint not null, "order" smallint not null, "type" text check ("type" in (\'Discord\', \'GitHub\', \'TikTok\', \'LinkedIn\', \'Instagram\', \'Facebook\', \'YouTube\', \'Twitch\')) not null, "pseudo" text not null, "url" text not null, constraint "social_pkey" primary key ("id"));');

    this.addSql('create table "shortcut" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'Team\', \'Project\', \'User\', \'Event\')) not null, "user_id" bigint not null, "target_actor_id" bigint not null, constraint "shortcut_pkey" primary key ("id"));');

    this.addSql('create table "report" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" text check ("type" in (\'Harassment\', \'Spam\', \'Inappropriate\', \'Other\')) not null, "reason" text null default null, "last_active_date" timestamptz(0) null default null, "actor_id" bigint null default null, "content_id" bigint null default null, constraint "report_pkey" primary key ("id"));');

    this.addSql('create table "follow" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "followed_actor_id" bigint not null, constraint "follow_pkey" primary key ("id"));');

    this.addSql('create table "favorite" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "last_active_date" timestamptz(0) null default null, "content_id" bigint null default null, "actor_id" bigint null default null, constraint "favorite_pkey" primary key ("id"));');

    this.addSql('create table "bot_info" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "owner_id" bigint not null, constraint "bot_info_pkey" primary key ("id"));');

    this.addSql('create table "actor_image" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "actor_id" bigint not null, "image_id" bigint not null, "type" text check ("type" in (\'Avatar\', \'AvatarDarkMode\', \'Banner\', \'Profile\')) not null, "last_active_date" timestamptz(0) null default null, constraint "actor_image_pkey" primary key ("id"));');
    this.addSql('alter table "actor_image" add constraint "actor_image_image_id_unique" unique ("image_id");');

    this.addSql('create table "actor_address" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "actor_id" bigint not null, "name" text not null, "latitude" real null default null, "longitude" real null default null, "street" text not null, "city" text not null, "zip" text not null, "state" text not null, "country" text check ("country" in (\'AF\', \'AX\', \'AL\', \'DZ\', \'AS\', \'AD\', \'AO\', \'AI\', \'AQ\', \'AG\', \'AR\', \'AM\', \'AW\', \'AU\', \'AT\', \'AZ\', \'BS\', \'BH\', \'BD\', \'BB\', \'BY\', \'BE\', \'BZ\', \'BJ\', \'BM\', \'BT\', \'BO\', \'BQ\', \'BA\', \'BW\', \'BV\', \'BR\', \'IO\', \'BN\', \'BG\', \'BF\', \'BI\', \'KH\', \'CM\', \'CA\', \'CV\', \'KY\', \'CF\', \'TD\', \'CL\', \'CN\', \'CX\', \'CC\', \'CO\', \'KM\', \'CG\', \'CD\', \'CK\', \'CR\', \'CI\', \'HR\', \'CU\', \'CW\', \'CY\', \'CZ\', \'DK\', \'DJ\', \'DM\', \'DO\', \'EC\', \'EG\', \'SV\', \'GQ\', \'ER\', \'EE\', \'ET\', \'FK\', \'FO\', \'FJ\', \'FI\', \'FR\', \'GF\', \'PF\', \'TF\', \'GA\', \'GM\', \'GE\', \'DE\', \'GH\', \'GI\', \'GR\', \'GL\', \'GD\', \'GP\', \'GU\', \'GT\', \'GG\', \'GN\', \'GW\', \'GY\', \'HT\', \'HM\', \'VA\', \'HN\', \'HK\', \'HU\', \'IS\', \'IN\', \'ID\', \'IR\', \'IQ\', \'IE\', \'IM\', \'IL\', \'IT\', \'JM\', \'JP\', \'JE\', \'JO\', \'KZ\', \'KE\', \'KI\', \'KR\', \'KP\', \'KW\', \'KG\', \'LA\', \'LV\', \'LB\', \'LS\', \'LR\', \'LY\', \'LI\', \'LT\', \'LU\', \'MO\', \'MK\', \'MG\', \'MW\', \'MY\', \'MV\', \'ML\', \'MT\', \'MH\', \'MQ\', \'MR\', \'MU\', \'YT\', \'MX\', \'FM\', \'MD\', \'MC\', \'MN\', \'ME\', \'MS\', \'MA\', \'MZ\', \'MM\', \'NA\', \'NR\', \'NP\', \'NL\', \'NC\', \'NZ\', \'NI\', \'NE\', \'NG\', \'NU\', \'NF\', \'MP\', \'NO\', \'OM\', \'PK\', \'PW\', \'PS\', \'PA\', \'PG\', \'PY\', \'PE\', \'PH\', \'PN\', \'PL\', \'PT\', \'PR\', \'QA\', \'RE\', \'RO\', \'RU\', \'RW\', \'BL\', \'SH\', \'KN\', \'LC\', \'MF\', \'PM\', \'VC\', \'WS\', \'SM\', \'ST\', \'SA\', \'SN\', \'RS\', \'SC\', \'SL\', \'SG\', \'SX\', \'SK\', \'SI\', \'SB\', \'SO\', \'ZA\', \'GS\', \'SS\', \'ES\', \'LK\', \'SD\', \'SR\', \'SJ\', \'SZ\', \'SE\', \'CH\', \'SY\', \'TW\', \'TJ\', \'TZ\', \'TH\', \'TL\', \'TG\', \'TK\', \'TO\', \'TT\', \'TN\', \'TR\', \'TM\', \'TC\', \'TV\', \'UG\', \'UA\', \'AE\', \'GB\', \'US\', \'UM\', \'UY\', \'UZ\', \'VU\', \'VE\', \'VN\', \'VG\', \'VI\', \'WF\', \'EH\', \'YE\', \'ZM\', \'ZW\')) not null default \'FR\', "image_id" bigint null default null, "campus_id" bigint null default null, "public" boolean not null, constraint "actor_address_pkey" primary key ("id"));');
    this.addSql('alter table "actor_address" add constraint "actor_address_image_id_unique" unique ("image_id");');
    this.addSql('alter table "actor_address" add constraint "actor_address_campus_id_unique" unique ("campus_id");');

    this.addSql('create table "actor_bank_info" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "actor_id" bigint not null, "address_id" bigint not null, "holder_name" text not null, "bank_code_bic" text not null, "full_acount" text not null, "country" text check ("country" in (\'AF\', \'AX\', \'AL\', \'DZ\', \'AS\', \'AD\', \'AO\', \'AI\', \'AQ\', \'AG\', \'AR\', \'AM\', \'AW\', \'AU\', \'AT\', \'AZ\', \'BS\', \'BH\', \'BD\', \'BB\', \'BY\', \'BE\', \'BZ\', \'BJ\', \'BM\', \'BT\', \'BO\', \'BQ\', \'BA\', \'BW\', \'BV\', \'BR\', \'IO\', \'BN\', \'BG\', \'BF\', \'BI\', \'KH\', \'CM\', \'CA\', \'CV\', \'KY\', \'CF\', \'TD\', \'CL\', \'CN\', \'CX\', \'CC\', \'CO\', \'KM\', \'CG\', \'CD\', \'CK\', \'CR\', \'CI\', \'HR\', \'CU\', \'CW\', \'CY\', \'CZ\', \'DK\', \'DJ\', \'DM\', \'DO\', \'EC\', \'EG\', \'SV\', \'GQ\', \'ER\', \'EE\', \'ET\', \'FK\', \'FO\', \'FJ\', \'FI\', \'FR\', \'GF\', \'PF\', \'TF\', \'GA\', \'GM\', \'GE\', \'DE\', \'GH\', \'GI\', \'GR\', \'GL\', \'GD\', \'GP\', \'GU\', \'GT\', \'GG\', \'GN\', \'GW\', \'GY\', \'HT\', \'HM\', \'VA\', \'HN\', \'HK\', \'HU\', \'IS\', \'IN\', \'ID\', \'IR\', \'IQ\', \'IE\', \'IM\', \'IL\', \'IT\', \'JM\', \'JP\', \'JE\', \'JO\', \'KZ\', \'KE\', \'KI\', \'KR\', \'KP\', \'KW\', \'KG\', \'LA\', \'LV\', \'LB\', \'LS\', \'LR\', \'LY\', \'LI\', \'LT\', \'LU\', \'MO\', \'MK\', \'MG\', \'MW\', \'MY\', \'MV\', \'ML\', \'MT\', \'MH\', \'MQ\', \'MR\', \'MU\', \'YT\', \'MX\', \'FM\', \'MD\', \'MC\', \'MN\', \'ME\', \'MS\', \'MA\', \'MZ\', \'MM\', \'NA\', \'NR\', \'NP\', \'NL\', \'NC\', \'NZ\', \'NI\', \'NE\', \'NG\', \'NU\', \'NF\', \'MP\', \'NO\', \'OM\', \'PK\', \'PW\', \'PS\', \'PA\', \'PG\', \'PY\', \'PE\', \'PH\', \'PN\', \'PL\', \'PT\', \'PR\', \'QA\', \'RE\', \'RO\', \'RU\', \'RW\', \'BL\', \'SH\', \'KN\', \'LC\', \'MF\', \'PM\', \'VC\', \'WS\', \'SM\', \'ST\', \'SA\', \'SN\', \'RS\', \'SC\', \'SL\', \'SG\', \'SX\', \'SK\', \'SI\', \'SB\', \'SO\', \'ZA\', \'GS\', \'SS\', \'ES\', \'LK\', \'SD\', \'SR\', \'SJ\', \'SZ\', \'SE\', \'CH\', \'SY\', \'TW\', \'TJ\', \'TZ\', \'TH\', \'TL\', \'TG\', \'TK\', \'TO\', \'TT\', \'TN\', \'TR\', \'TM\', \'TC\', \'TV\', \'UG\', \'UA\', \'AE\', \'GB\', \'US\', \'UM\', \'UY\', \'UZ\', \'VU\', \'VE\', \'VN\', \'VG\', \'VI\', \'WF\', \'EH\', \'YE\', \'ZM\', \'ZW\')) not null, "country_code" text not null, "bank_code" text not null, "agency_code" text not null, "account_code" text not null, "checksum" text not null, constraint "actor_bank_info_pkey" primary key ("id"));');

    this.addSql('create table "expense" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "issue_id" bigint null default null, "expense_report_id" bigint not null, "bank_info_id" bigint not null, "state" text check ("state" in (\'PendingReimbursement\', \'PendingReimbursementConfirmation\', \'ReimbursementContested\', \'Cancelled\', \'CancellationContested\', \'Reimbursed\')) not null, "description" text not null, constraint "expense_pkey" primary key ("id"));');

    this.addSql('create table "actor_finance" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "description" text not null default \'\', "amount" real not null, "category" text check ("category" in (\'Entertainment\', \'Equipement\', \'Errands\', \'MemberReimbursement\', \'MembershipFees\', \'Subvention\', \'Marketing\', \'Subscriptions\', \'Transportation\', \'Other\')) not null, "payed_at" timestamptz(0) not null, "payed_by_id" bigint null default null, "address_id" bigint null default null, "expense_id" bigint null, "receipt_id" bigint not null, constraint "actor_finance_pkey" primary key ("id"));');

    this.addSql('create table "actor_tags" ("actor_id" bigint not null, "tag_id" bigint not null, constraint "actor_tags_pkey" primary key ("actor_id", "tag_id"));');

    this.addSql('create table "event" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "price" real not null default 0, "presence_reward" real not null default 0, "is_private" boolean not null default false, "auto_accept_joins" boolean not null default true, "state" text check ("state" in (\'Template\', \'Draft\', \'Submitted\', \'Rejected\', \'Approved\', \'Published\')) not null default \'Draft\', "content_master_id" bigint not null, "meta" jsonb not null default \'{}\', "budget" real null default null, "address_id" bigint null default null, "online_meeting_place" text null default null, "online_meeting_link" text null default null, "supervisor_id" bigint not null, "image_id" bigint null default null, "join_form_id" bigint null default null, "project_id" bigint not null, "approval_submission_id" bigint null default null, "last_event_approval_step_id" bigint null default null, constraint "event_pkey" primary key ("id"));');
    this.addSql('create index "event_is_private_index" on "event" ("is_private");');
    this.addSql('alter table "event" add constraint "event_content_master_id_unique" unique ("content_master_id");');
    this.addSql('alter table "event" add constraint "event_approval_submission_id_unique" unique ("approval_submission_id");');

    this.addSql('create table "team_finance" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "description" text not null default \'\', "amount" real not null, "method" text check ("method" in (\'Cash\', \'CreditCard\', \'Transfer\', \'DirectDebit\', \'Check\', \'MobilePayment\', \'Other\')) not null, "state" text check ("state" in (\'Canceled\', \'Ongoing\', \'Completed\')) not null default \'Completed\', "category" text check ("category" in (\'Entertainment\', \'Equipement\', \'Errands\', \'MemberReimbursement\', \'MembershipFees\', \'Subvention\', \'Marketing\', \'Subscriptions\', \'Transportation\', \'Other\')) not null, "payed_at" timestamptz(0) not null, "team_id" bigint not null, "payed_by_type" text check ("payed_by_type" in (\'Unknown\', \'Automatic\', \'Outsider\', \'Manual\')) not null default \'Manual\', "payed_by_id" bigint null default null, "address_type" text check ("address_type" in (\'Known\', \'Online\', \'Unknown\')) not null default \'Known\', "address_id" bigint null default null, "expense_id" bigint null, "event_id" bigint null default null, "project_id" bigint null default null, "receipt_id" bigint null default null, constraint "team_finance_pkey" primary key ("id"));');
    this.addSql('alter table "team_finance" add constraint "team_finance_expense_id_unique" unique ("expense_id");');

    this.addSql('create table "team_events" ("team_id" bigint not null, "event_id" bigint not null, constraint "team_events_pkey" primary key ("team_id", "event_id"));');

    this.addSql('create table "event_role" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "user_id" bigint null default null, "event_id" bigint not null, "project_role_id" bigint not null, "description" text not null default \'\', "auto_accept" boolean not null, "reward_minimum" smallint null default null, "reward_maximum" smallint null default null, "name" text not null, "color" text check ("color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\')) not null, "required" boolean not null, constraint "event_role_pkey" primary key ("id"));');

    this.addSql('create table "event_change_role" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "received_role_id" bigint null default null, "accepted" boolean not null, "note" text not null, constraint "event_change_role_pkey" primary key ("id"));');

    this.addSql('create table "event_approval" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "message" text null default null, "approved" boolean not null, "event_id" bigint null, "step_id" bigint null, constraint "event_approval_pkey" primary key ("id"));');

    this.addSql('create table "event_tags" ("event_id" bigint not null, "tag_id" bigint not null, constraint "event_tags_pkey" primary key ("event_id", "tag_id"));');

    this.addSql('create table "class_group_teacher" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "user_id" bigint not null, "class_group_id" bigint not null, "start_date" timestamptz(0) not null, "end_date" timestamptz(0) null default null, constraint "class_group_teacher_pkey" primary key ("id"));');

    this.addSql('create table "class_group_teacher_subjects" ("class_group_teacher_id" bigint not null, "subject_id" bigint not null, constraint "class_group_teacher_subjects_pkey" primary key ("class_group_teacher_id", "subject_id"));');

    this.addSql('create table "change_role" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "team_id" bigint not null, "user_id" bigint not null, "received_role_id" bigint null default null, "received_pole_id" bigint null default null, "note" text not null, constraint "change_role_pkey" primary key ("id"));');

    this.addSql('create table "team_join" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "state" text check ("state" in (\'Approved\', \'Canceled\', \'Pending\', \'Rejected\')) not null default \'Pending\', "joiner_id" bigint not null, "form_submission_id" bigint null default null, "team_id" bigint not null, "asked_role_id" bigint not null, "change_role_id" bigint null, constraint "team_join_pkey" primary key ("id"));');
    this.addSql('alter table "team_join" add constraint "team_join_change_role_id_unique" unique ("change_role_id");');

    this.addSql('create table "action" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "name" text not null, "description" text null default null, "state" text check ("state" in (\'Approved\', \'Canceled\', \'Pending\', \'Rejected\')) not null, "score" int not null default 0, "team_id" bigint not null, "event_id" bigint null default null, "user_id" bigint not null, "event_join_id" bigint null default null, "project_id" bigint null default null, "validated_by_id" bigint null default null, constraint "action_pkey" primary key ("id"));');

    this.addSql('create table "event_join" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "event_id" bigint not null, "event_role_id" bigint null default null, "participated" boolean null default null, "action_id" bigint null default null, "qr_code_id" bigint null default null, "state" text check ("state" in (\'Approved\', \'Canceled\', \'Pending\', \'Rejected\')) not null default \'Pending\', "attendance_status" text check ("attendance_status" in (\'Sure\', \'Absent\')) not null default \'Sure\', "joiner_id" bigint not null, "form_submission_id" bigint null default null, "event_change_role_id" bigint null, constraint "event_join_pkey" primary key ("id"));');
    this.addSql('alter table "event_join" add constraint "event_join_event_change_role_id_unique" unique ("event_change_role_id");');

    this.addSql('create table "event_attendance" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "event_join_id" bigint not null, "participated" boolean not null, "confirmed_via" text check ("confirmed_via" in (\'QR\', \'Manual\', \'Automatic\')) not null, constraint "event_attendance_pkey" primary key ("id"));');

    this.addSql('create table "validation" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "type" varchar(255) not null, "last_active_date" timestamptz(0) null default null, "content_id" bigint null default null, constraint "validation_pkey" primary key ("id"));');

    this.addSql('create table "vote" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "value" smallint not null, "last_active_date" timestamptz(0) null default null, "content_id" bigint null default null, constraint "vote_pkey" primary key ("id"));');

    this.addSql('alter table "user_info" add constraint "user_info_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "user_info" add constraint "user_info_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "canteen" add constraint "canteen_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "canteen" add constraint "canteen_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "tenant" add constraint "tenant_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "tenant" add constraint "tenant_event_validation_form_id_foreign" foreign key ("event_validation_form_id") references "form" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "tenant" add constraint "tenant_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team" add constraint "team_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team" add constraint "team_canteen_id_foreign" foreign key ("canteen_id") references "canteen" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_cohort_id_foreign" foreign key ("cohort_id") references "cohort" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_class_group_id_foreign" foreign key ("class_group_id") references "class_group" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_parent_id_foreign" foreign key ("parent_id") references "team" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team" add constraint "team_video_id_foreign" foreign key ("video_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "individual" add constraint "individual_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "individual" add constraint "individual_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "individual" add constraint "individual_user_id_foreign" foreign key ("user_id") references "user_info" ("id") on update cascade on delete set null;');
    this.addSql('alter table "individual" add constraint "individual_bot_id_foreign" foreign key ("bot_id") references "bot_info" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_metric" add constraint "team_metric_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_metric" add constraint "team_metric_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "team_member" add constraint "team_member_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_member" add constraint "team_member_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team_member" add constraint "team_member_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "team_member" add constraint "team_member_user_id_foreign" foreign key ("user_id") references "user_info" ("id") on update cascade;');

    this.addSql('alter table "subject" add constraint "subject_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "subject" add constraint "subject_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "session" add constraint "session_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "session" add constraint "session_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user_info" ("id") on update cascade;');

    this.addSql('alter table "role" add constraint "role_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "role" add constraint "role_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "role" add constraint "role_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "team_member_roles" add constraint "team_member_roles_team_member_id_foreign" foreign key ("team_member_id") references "team_member" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_member_roles" add constraint "team_member_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "pole" add constraint "pole_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "pole" add constraint "pole_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "pole" add constraint "pole_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "form" add constraint "form_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "form" add constraint "form_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "form" add constraint "form_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;');

    this.addSql('alter table "file_upload" add constraint "file_upload_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "file_upload" add constraint "file_upload_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "tag" add constraint "tag_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "tag" add constraint "tag_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "tag" add constraint "tag_image_id_foreign" foreign key ("image_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "project" add constraint "project_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "project" add constraint "project_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "project" add constraint "project_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "project" add constraint "project_image_id_foreign" foreign key ("image_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "project_role" add constraint "project_role_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "project_role" add constraint "project_role_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "project_role" add constraint "project_role_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('alter table "project_tags" add constraint "project_tags_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "project_tags" add constraint "project_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "project_supervisors" add constraint "project_supervisors_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "project_supervisors" add constraint "project_supervisors_team_member_id_foreign" foreign key ("team_member_id") references "team_member" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event_approval_step" add constraint "event_approval_step_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_approval_step" add constraint "event_approval_step_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event_approval_step" add constraint "event_approval_step_previous_step_id_foreign" foreign key ("previous_step_id") references "event_approval_step" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event_approval_step_validators" add constraint "event_approval_step_validators_event_approval_step_id_foreign" foreign key ("event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval_step_validators" add constraint "event_approval_step_validators_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event_approval_step_notifiees" add constraint "event_approval_step_notifiees_event_approval_step_id_foreign" foreign key ("event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval_step_notifiees" add constraint "event_approval_step_notifiees_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content" add constraint "content_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content" add constraint "content_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "content" add constraint "content_parent_id_foreign" foreign key ("parent_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "reaction" add constraint "reaction_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "reaction" add constraint "reaction_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "reaction" add constraint "reaction_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "content_master" add constraint "content_master_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content_master" add constraint "content_master_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "content_master" add constraint "content_master_root_content_id_foreign" foreign key ("root_content_id") references "content" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "log" add constraint "log_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "log" add constraint "log_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "log" add constraint "log_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;');
    this.addSql('alter table "log" add constraint "log_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete set null;');
    this.addSql('alter table "log" add constraint "log_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete set null;');

    this.addSql('alter table "issue" add constraint "issue_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "issue" add constraint "issue_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "issue" add constraint "issue_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade;');

    this.addSql('alter table "content_master_tags" add constraint "content_master_tags_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_tags" add constraint "content_master_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content_master_contributors" add constraint "content_master_contributors_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_contributors" add constraint "content_master_contributors_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content_attachments" add constraint "content_attachments_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_attachments" add constraint "content_attachments_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "cohort" add constraint "cohort_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "cohort" add constraint "cohort_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "class_group" add constraint "class_group_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "class_group" add constraint "class_group_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "subject_class_groups" add constraint "subject_class_groups_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "subject_class_groups" add constraint "subject_class_groups_class_group_id_foreign" foreign key ("class_group_id") references "class_group" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "form_edit" add constraint "form_edit_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "form_edit" add constraint "form_edit_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "form_edit" add constraint "form_edit_form_id_foreign" foreign key ("form_id") references "form" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "form_submission" add constraint "form_submission_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "form_submission" add constraint "form_submission_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "form_submission" add constraint "form_submission_form_edit_id_foreign" foreign key ("form_edit_id") references "form_edit" ("id") on update cascade;');

    this.addSql('alter table "form_submission_edit" add constraint "form_submission_edit_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "form_submission_edit" add constraint "form_submission_edit_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "form_submission_edit" add constraint "form_submission_edit_form_submission_id_foreign" foreign key ("form_submission_id") references "form_submission" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "document" add constraint "document_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "document" add constraint "document_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "document" add constraint "document_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "document" add constraint "document_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade on delete set null;');
    this.addSql('alter table "document" add constraint "document_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;');

    this.addSql('alter table "document_edit" add constraint "document_edit_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "document_edit" add constraint "document_edit_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "document_edit" add constraint "document_edit_new_version_id_foreign" foreign key ("new_version_id") references "file_upload" ("id") on update cascade;');
    this.addSql('alter table "document_edit" add constraint "document_edit_document_id_foreign" foreign key ("document_id") references "document" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "content_teams" add constraint "content_teams_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_teams" add constraint "content_teams_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "canteen_menu" add constraint "canteen_menu_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "canteen_menu" add constraint "canteen_menu_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "canteen_menu" add constraint "canteen_menu_canteen_id_foreign" foreign key ("canteen_id") references "canteen" ("id") on update cascade;');

    this.addSql('alter table "canteen_food" add constraint "canteen_food_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "canteen_food" add constraint "canteen_food_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "canteen_food" add constraint "canteen_food_canteen_id_foreign" foreign key ("canteen_id") references "canteen" ("id") on update cascade;');

    this.addSql('alter table "campus" add constraint "campus_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "campus" add constraint "campus_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "actor" add constraint "actor_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor" add constraint "actor_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "actor" add constraint "actor_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor" add constraint "actor_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;');

    this.addSql('alter table "social" add constraint "social_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "social" add constraint "social_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "social" add constraint "social_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "shortcut" add constraint "shortcut_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "shortcut" add constraint "shortcut_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "shortcut" add constraint "shortcut_user_id_foreign" foreign key ("user_id") references "user_info" ("id") on update cascade;');
    this.addSql('alter table "shortcut" add constraint "shortcut_target_actor_id_foreign" foreign key ("target_actor_id") references "actor" ("id") on update cascade;');

    this.addSql('alter table "report" add constraint "report_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "report" add constraint "report_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "report" add constraint "report_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete set null;');
    this.addSql('alter table "report" add constraint "report_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "follow" add constraint "follow_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "follow" add constraint "follow_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "follow" add constraint "follow_followed_actor_id_foreign" foreign key ("followed_actor_id") references "actor" ("id") on update cascade;');

    this.addSql('alter table "favorite" add constraint "favorite_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "favorite" add constraint "favorite_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "favorite" add constraint "favorite_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');
    this.addSql('alter table "favorite" add constraint "favorite_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete set null;');

    this.addSql('alter table "bot_info" add constraint "bot_info_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "bot_info" add constraint "bot_info_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "bot_info" add constraint "bot_info_owner_id_foreign" foreign key ("owner_id") references "actor" ("id") on update cascade;');

    this.addSql('alter table "actor_image" add constraint "actor_image_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor_image" add constraint "actor_image_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "actor_image" add constraint "actor_image_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "actor_image" add constraint "actor_image_image_id_foreign" foreign key ("image_id") references "file_upload" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "actor_address" add constraint "actor_address_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor_address" add constraint "actor_address_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "actor_address" add constraint "actor_address_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "actor_address" add constraint "actor_address_image_id_foreign" foreign key ("image_id") references "file_upload" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor_address" add constraint "actor_address_campus_id_foreign" foreign key ("campus_id") references "campus" ("id") on update cascade on delete set null;');

    this.addSql('alter table "actor_bank_info" add constraint "actor_bank_info_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor_bank_info" add constraint "actor_bank_info_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "actor_bank_info" add constraint "actor_bank_info_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade;');
    this.addSql('alter table "actor_bank_info" add constraint "actor_bank_info_address_id_foreign" foreign key ("address_id") references "actor_address" ("id") on update cascade;');

    this.addSql('alter table "expense" add constraint "expense_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "expense" add constraint "expense_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "expense" add constraint "expense_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete set null;');
    this.addSql('alter table "expense" add constraint "expense_expense_report_id_foreign" foreign key ("expense_report_id") references "file_upload" ("id") on update cascade;');
    this.addSql('alter table "expense" add constraint "expense_bank_info_id_foreign" foreign key ("bank_info_id") references "actor_bank_info" ("id") on update cascade;');

    this.addSql('alter table "actor_finance" add constraint "actor_finance_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor_finance" add constraint "actor_finance_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "actor_finance" add constraint "actor_finance_payed_by_id_foreign" foreign key ("payed_by_id") references "actor" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor_finance" add constraint "actor_finance_address_id_foreign" foreign key ("address_id") references "actor_address" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor_finance" add constraint "actor_finance_expense_id_foreign" foreign key ("expense_id") references "expense" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor_finance" add constraint "actor_finance_receipt_id_foreign" foreign key ("receipt_id") references "file_upload" ("id") on update cascade;');

    this.addSql('alter table "actor_tags" add constraint "actor_tags_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "actor_tags" add constraint "actor_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event" add constraint "event_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event" add constraint "event_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade;');
    this.addSql('alter table "event" add constraint "event_address_id_foreign" foreign key ("address_id") references "actor_address" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_supervisor_id_foreign" foreign key ("supervisor_id") references "user_info" ("id") on update cascade;');
    this.addSql('alter table "event" add constraint "event_image_id_foreign" foreign key ("image_id") references "file_upload" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event" add constraint "event_join_form_id_foreign" foreign key ("join_form_id") references "form" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');
    this.addSql('alter table "event" add constraint "event_approval_submission_id_foreign" foreign key ("approval_submission_id") references "form_submission" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" add constraint "event_last_event_approval_step_id_foreign" foreign key ("last_event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_finance" add constraint "team_finance_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team_finance" add constraint "team_finance_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "team_finance" add constraint "team_finance_payed_by_id_foreign" foreign key ("payed_by_id") references "actor" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_address_id_foreign" foreign key ("address_id") references "actor_address" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_expense_id_foreign" foreign key ("expense_id") references "expense" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_receipt_id_foreign" foreign key ("receipt_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_events" add constraint "team_events_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_events" add constraint "team_events_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event_role" add constraint "event_role_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_role" add constraint "event_role_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event_role" add constraint "event_role_user_id_foreign" foreign key ("user_id") references "user_info" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_role" add constraint "event_role_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;');
    this.addSql('alter table "event_role" add constraint "event_role_project_role_id_foreign" foreign key ("project_role_id") references "project_role" ("id") on update cascade;');

    this.addSql('alter table "event_change_role" add constraint "event_change_role_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_change_role" add constraint "event_change_role_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event_change_role" add constraint "event_change_role_received_role_id_foreign" foreign key ("received_role_id") references "event_role" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event_approval" add constraint "event_approval_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_approval" add constraint "event_approval_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event_approval" add constraint "event_approval_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval" add constraint "event_approval_step_id_foreign" foreign key ("step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event_tags" add constraint "event_tags_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_tags" add constraint "event_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_user_id_foreign" foreign key ("user_id") references "user_info" ("id") on update cascade;');
    this.addSql('alter table "class_group_teacher" add constraint "class_group_teacher_class_group_id_foreign" foreign key ("class_group_id") references "class_group" ("id") on update cascade;');

    this.addSql('alter table "class_group_teacher_subjects" add constraint "class_group_teacher_subjects_class_group_teacher_id_foreign" foreign key ("class_group_teacher_id") references "class_group_teacher" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "class_group_teacher_subjects" add constraint "class_group_teacher_subjects_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "change_role" add constraint "change_role_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "change_role" add constraint "change_role_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "change_role" add constraint "change_role_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "change_role" add constraint "change_role_user_id_foreign" foreign key ("user_id") references "user_info" ("id") on update cascade;');
    this.addSql('alter table "change_role" add constraint "change_role_received_role_id_foreign" foreign key ("received_role_id") references "role" ("id") on update cascade on delete set null;');
    this.addSql('alter table "change_role" add constraint "change_role_received_pole_id_foreign" foreign key ("received_pole_id") references "pole" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_join" add constraint "team_join_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_join" add constraint "team_join_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "team_join" add constraint "team_join_joiner_id_foreign" foreign key ("joiner_id") references "user_info" ("id") on update cascade;');
    this.addSql('alter table "team_join" add constraint "team_join_form_submission_id_foreign" foreign key ("form_submission_id") references "form_submission" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_join" add constraint "team_join_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "team_join" add constraint "team_join_asked_role_id_foreign" foreign key ("asked_role_id") references "role" ("id") on update cascade;');
    this.addSql('alter table "team_join" add constraint "team_join_change_role_id_foreign" foreign key ("change_role_id") references "change_role" ("id") on update cascade on delete set null;');

    this.addSql('alter table "action" add constraint "action_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "action" add constraint "action_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "action" add constraint "action_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "action" add constraint "action_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete set null;');
    this.addSql('alter table "action" add constraint "action_user_id_foreign" foreign key ("user_id") references "user_info" ("id") on update cascade;');
    this.addSql('alter table "action" add constraint "action_event_join_id_foreign" foreign key ("event_join_id") references "event_join" ("id") on update cascade on delete set null;');
    this.addSql('alter table "action" add constraint "action_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;');
    this.addSql('alter table "action" add constraint "action_validated_by_id_foreign" foreign key ("validated_by_id") references "individual" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event_join" add constraint "event_join_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_join" add constraint "event_join_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event_join" add constraint "event_join_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;');
    this.addSql('alter table "event_join" add constraint "event_join_event_role_id_foreign" foreign key ("event_role_id") references "event_role" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_join" add constraint "event_join_action_id_foreign" foreign key ("action_id") references "action" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_join" add constraint "event_join_qr_code_id_foreign" foreign key ("qr_code_id") references "file_upload" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_join" add constraint "event_join_joiner_id_foreign" foreign key ("joiner_id") references "user_info" ("id") on update cascade;');
    this.addSql('alter table "event_join" add constraint "event_join_form_submission_id_foreign" foreign key ("form_submission_id") references "form_submission" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_join" add constraint "event_join_event_change_role_id_foreign" foreign key ("event_change_role_id") references "event_change_role" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event_attendance" add constraint "event_attendance_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_attendance" add constraint "event_attendance_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event_attendance" add constraint "event_attendance_event_join_id_foreign" foreign key ("event_join_id") references "event_join" ("id") on update cascade;');

    this.addSql('alter table "validation" add constraint "validation_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "validation" add constraint "validation_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "validation" add constraint "validation_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "vote" add constraint "vote_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "vote" add constraint "vote_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "vote" add constraint "vote_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "individual" drop constraint "individual_user_id_foreign";');

    this.addSql('alter table "team_member" drop constraint "team_member_user_id_foreign";');

    this.addSql('alter table "session" drop constraint "session_user_id_foreign";');

    this.addSql('alter table "shortcut" drop constraint "shortcut_user_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_supervisor_id_foreign";');

    this.addSql('alter table "event_role" drop constraint "event_role_user_id_foreign";');

    this.addSql('alter table "class_group_teacher" drop constraint "class_group_teacher_user_id_foreign";');

    this.addSql('alter table "change_role" drop constraint "change_role_user_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_joiner_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_user_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_joiner_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_canteen_id_foreign";');

    this.addSql('alter table "canteen_menu" drop constraint "canteen_menu_canteen_id_foreign";');

    this.addSql('alter table "canteen_food" drop constraint "canteen_food_canteen_id_foreign";');

    this.addSql('alter table "user_info" drop constraint "user_info_tenant_id_foreign";');

    this.addSql('alter table "canteen" drop constraint "canteen_tenant_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_tenant_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_tenant_id_foreign";');

    this.addSql('alter table "team_metric" drop constraint "team_metric_tenant_id_foreign";');

    this.addSql('alter table "team_member" drop constraint "team_member_tenant_id_foreign";');

    this.addSql('alter table "subject" drop constraint "subject_tenant_id_foreign";');

    this.addSql('alter table "session" drop constraint "session_tenant_id_foreign";');

    this.addSql('alter table "role" drop constraint "role_tenant_id_foreign";');

    this.addSql('alter table "pole" drop constraint "pole_tenant_id_foreign";');

    this.addSql('alter table "form" drop constraint "form_tenant_id_foreign";');

    this.addSql('alter table "file_upload" drop constraint "file_upload_tenant_id_foreign";');

    this.addSql('alter table "tag" drop constraint "tag_tenant_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_tenant_id_foreign";');

    this.addSql('alter table "project_role" drop constraint "project_role_tenant_id_foreign";');

    this.addSql('alter table "event_approval_step" drop constraint "event_approval_step_tenant_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_tenant_id_foreign";');

    this.addSql('alter table "reaction" drop constraint "reaction_tenant_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_tenant_id_foreign";');

    this.addSql('alter table "log" drop constraint "log_tenant_id_foreign";');

    this.addSql('alter table "issue" drop constraint "issue_tenant_id_foreign";');

    this.addSql('alter table "cohort" drop constraint "cohort_tenant_id_foreign";');

    this.addSql('alter table "class_group" drop constraint "class_group_tenant_id_foreign";');

    this.addSql('alter table "form_edit" drop constraint "form_edit_tenant_id_foreign";');

    this.addSql('alter table "form_submission" drop constraint "form_submission_tenant_id_foreign";');

    this.addSql('alter table "form_submission_edit" drop constraint "form_submission_edit_tenant_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_tenant_id_foreign";');

    this.addSql('alter table "document_edit" drop constraint "document_edit_tenant_id_foreign";');

    this.addSql('alter table "canteen_menu" drop constraint "canteen_menu_tenant_id_foreign";');

    this.addSql('alter table "canteen_food" drop constraint "canteen_food_tenant_id_foreign";');

    this.addSql('alter table "campus" drop constraint "campus_tenant_id_foreign";');

    this.addSql('alter table "actor" drop constraint "actor_tenant_id_foreign";');

    this.addSql('alter table "social" drop constraint "social_tenant_id_foreign";');

    this.addSql('alter table "shortcut" drop constraint "shortcut_tenant_id_foreign";');

    this.addSql('alter table "report" drop constraint "report_tenant_id_foreign";');

    this.addSql('alter table "follow" drop constraint "follow_tenant_id_foreign";');

    this.addSql('alter table "favorite" drop constraint "favorite_tenant_id_foreign";');

    this.addSql('alter table "bot_info" drop constraint "bot_info_tenant_id_foreign";');

    this.addSql('alter table "actor_image" drop constraint "actor_image_tenant_id_foreign";');

    this.addSql('alter table "actor_address" drop constraint "actor_address_tenant_id_foreign";');

    this.addSql('alter table "actor_bank_info" drop constraint "actor_bank_info_tenant_id_foreign";');

    this.addSql('alter table "expense" drop constraint "expense_tenant_id_foreign";');

    this.addSql('alter table "actor_finance" drop constraint "actor_finance_tenant_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_tenant_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_tenant_id_foreign";');

    this.addSql('alter table "event_role" drop constraint "event_role_tenant_id_foreign";');

    this.addSql('alter table "event_change_role" drop constraint "event_change_role_tenant_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_tenant_id_foreign";');

    this.addSql('alter table "class_group_teacher" drop constraint "class_group_teacher_tenant_id_foreign";');

    this.addSql('alter table "change_role" drop constraint "change_role_tenant_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_tenant_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_tenant_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_tenant_id_foreign";');

    this.addSql('alter table "event_attendance" drop constraint "event_attendance_tenant_id_foreign";');

    this.addSql('alter table "validation" drop constraint "validation_tenant_id_foreign";');

    this.addSql('alter table "vote" drop constraint "vote_tenant_id_foreign";');

    this.addSql('alter table "tenant" drop constraint "tenant_team_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_parent_id_foreign";');

    this.addSql('alter table "team_member" drop constraint "team_member_team_id_foreign";');

    this.addSql('alter table "role" drop constraint "role_team_id_foreign";');

    this.addSql('alter table "pole" drop constraint "pole_team_id_foreign";');

    this.addSql('alter table "form" drop constraint "form_team_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_team_id_foreign";');

    this.addSql('alter table "log" drop constraint "log_team_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_team_id_foreign";');

    this.addSql('alter table "content_teams" drop constraint "content_teams_team_id_foreign";');

    this.addSql('alter table "actor" drop constraint "actor_team_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_team_id_foreign";');

    this.addSql('alter table "team_events" drop constraint "team_events_team_id_foreign";');

    this.addSql('alter table "change_role" drop constraint "change_role_team_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_team_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_team_id_foreign";');

    this.addSql('alter table "user_info" drop constraint "user_info_created_by_id_foreign";');

    this.addSql('alter table "canteen" drop constraint "canteen_created_by_id_foreign";');

    this.addSql('alter table "tenant" drop constraint "tenant_created_by_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_created_by_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_created_by_id_foreign";');

    this.addSql('alter table "team_metric" drop constraint "team_metric_created_by_id_foreign";');

    this.addSql('alter table "team_member" drop constraint "team_member_created_by_id_foreign";');

    this.addSql('alter table "subject" drop constraint "subject_created_by_id_foreign";');

    this.addSql('alter table "session" drop constraint "session_created_by_id_foreign";');

    this.addSql('alter table "role" drop constraint "role_created_by_id_foreign";');

    this.addSql('alter table "pole" drop constraint "pole_created_by_id_foreign";');

    this.addSql('alter table "form" drop constraint "form_created_by_id_foreign";');

    this.addSql('alter table "file_upload" drop constraint "file_upload_created_by_id_foreign";');

    this.addSql('alter table "tag" drop constraint "tag_created_by_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_created_by_id_foreign";');

    this.addSql('alter table "project_role" drop constraint "project_role_created_by_id_foreign";');

    this.addSql('alter table "event_approval_step" drop constraint "event_approval_step_created_by_id_foreign";');

    this.addSql('alter table "event_approval_step_validators" drop constraint "event_approval_step_validators_individual_id_foreign";');

    this.addSql('alter table "event_approval_step_notifiees" drop constraint "event_approval_step_notifiees_individual_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_created_by_id_foreign";');

    this.addSql('alter table "reaction" drop constraint "reaction_created_by_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_created_by_id_foreign";');

    this.addSql('alter table "log" drop constraint "log_created_by_id_foreign";');

    this.addSql('alter table "log" drop constraint "log_individual_id_foreign";');

    this.addSql('alter table "issue" drop constraint "issue_created_by_id_foreign";');

    this.addSql('alter table "content_master_contributors" drop constraint "content_master_contributors_individual_id_foreign";');

    this.addSql('alter table "cohort" drop constraint "cohort_created_by_id_foreign";');

    this.addSql('alter table "class_group" drop constraint "class_group_created_by_id_foreign";');

    this.addSql('alter table "form_edit" drop constraint "form_edit_created_by_id_foreign";');

    this.addSql('alter table "form_submission" drop constraint "form_submission_created_by_id_foreign";');

    this.addSql('alter table "form_submission_edit" drop constraint "form_submission_edit_created_by_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_created_by_id_foreign";');

    this.addSql('alter table "document_edit" drop constraint "document_edit_created_by_id_foreign";');

    this.addSql('alter table "canteen_menu" drop constraint "canteen_menu_created_by_id_foreign";');

    this.addSql('alter table "canteen_food" drop constraint "canteen_food_created_by_id_foreign";');

    this.addSql('alter table "campus" drop constraint "campus_created_by_id_foreign";');

    this.addSql('alter table "actor" drop constraint "actor_created_by_id_foreign";');

    this.addSql('alter table "actor" drop constraint "actor_individual_id_foreign";');

    this.addSql('alter table "social" drop constraint "social_created_by_id_foreign";');

    this.addSql('alter table "shortcut" drop constraint "shortcut_created_by_id_foreign";');

    this.addSql('alter table "report" drop constraint "report_created_by_id_foreign";');

    this.addSql('alter table "follow" drop constraint "follow_created_by_id_foreign";');

    this.addSql('alter table "favorite" drop constraint "favorite_created_by_id_foreign";');

    this.addSql('alter table "bot_info" drop constraint "bot_info_created_by_id_foreign";');

    this.addSql('alter table "actor_image" drop constraint "actor_image_created_by_id_foreign";');

    this.addSql('alter table "actor_address" drop constraint "actor_address_created_by_id_foreign";');

    this.addSql('alter table "actor_bank_info" drop constraint "actor_bank_info_created_by_id_foreign";');

    this.addSql('alter table "expense" drop constraint "expense_created_by_id_foreign";');

    this.addSql('alter table "actor_finance" drop constraint "actor_finance_created_by_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_created_by_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_created_by_id_foreign";');

    this.addSql('alter table "event_role" drop constraint "event_role_created_by_id_foreign";');

    this.addSql('alter table "event_change_role" drop constraint "event_change_role_created_by_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_created_by_id_foreign";');

    this.addSql('alter table "class_group_teacher" drop constraint "class_group_teacher_created_by_id_foreign";');

    this.addSql('alter table "change_role" drop constraint "change_role_created_by_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_created_by_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_created_by_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_validated_by_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_created_by_id_foreign";');

    this.addSql('alter table "event_attendance" drop constraint "event_attendance_created_by_id_foreign";');

    this.addSql('alter table "validation" drop constraint "validation_created_by_id_foreign";');

    this.addSql('alter table "vote" drop constraint "vote_created_by_id_foreign";');

    this.addSql('alter table "team_member_roles" drop constraint "team_member_roles_team_member_id_foreign";');

    this.addSql('alter table "project_supervisors" drop constraint "project_supervisors_team_member_id_foreign";');

    this.addSql('alter table "subject_class_groups" drop constraint "subject_class_groups_subject_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_subject_id_foreign";');

    this.addSql('alter table "class_group_teacher_subjects" drop constraint "class_group_teacher_subjects_subject_id_foreign";');

    this.addSql('alter table "team_member_roles" drop constraint "team_member_roles_role_id_foreign";');

    this.addSql('alter table "change_role" drop constraint "change_role_received_role_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_asked_role_id_foreign";');

    this.addSql('alter table "change_role" drop constraint "change_role_received_pole_id_foreign";');

    this.addSql('alter table "tenant" drop constraint "tenant_event_validation_form_id_foreign";');

    this.addSql('alter table "form_edit" drop constraint "form_edit_form_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_join_form_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_video_id_foreign";');

    this.addSql('alter table "tag" drop constraint "tag_image_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_image_id_foreign";');

    this.addSql('alter table "content_attachments" drop constraint "content_attachments_file_upload_id_foreign";');

    this.addSql('alter table "document" drop constraint "document_file_id_foreign";');

    this.addSql('alter table "document_edit" drop constraint "document_edit_new_version_id_foreign";');

    this.addSql('alter table "actor_image" drop constraint "actor_image_image_id_foreign";');

    this.addSql('alter table "actor_address" drop constraint "actor_address_image_id_foreign";');

    this.addSql('alter table "expense" drop constraint "expense_expense_report_id_foreign";');

    this.addSql('alter table "actor_finance" drop constraint "actor_finance_receipt_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_image_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_receipt_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_qr_code_id_foreign";');

    this.addSql('alter table "project_tags" drop constraint "project_tags_tag_id_foreign";');

    this.addSql('alter table "content_master_tags" drop constraint "content_master_tags_tag_id_foreign";');

    this.addSql('alter table "actor_tags" drop constraint "actor_tags_tag_id_foreign";');

    this.addSql('alter table "event_tags" drop constraint "event_tags_tag_id_foreign";');

    this.addSql('alter table "project_role" drop constraint "project_role_project_id_foreign";');

    this.addSql('alter table "project_tags" drop constraint "project_tags_project_id_foreign";');

    this.addSql('alter table "project_supervisors" drop constraint "project_supervisors_project_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_project_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_project_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_project_id_foreign";');

    this.addSql('alter table "event_role" drop constraint "event_role_project_role_id_foreign";');

    this.addSql('alter table "event_approval_step" drop constraint "event_approval_step_previous_step_id_foreign";');

    this.addSql('alter table "event_approval_step_validators" drop constraint "event_approval_step_validators_event_approval_step_id_foreign";');

    this.addSql('alter table "event_approval_step_notifiees" drop constraint "event_approval_step_notifiees_event_approval_step_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_last_event_approval_step_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_step_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_parent_id_foreign";');

    this.addSql('alter table "reaction" drop constraint "reaction_content_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_root_content_id_foreign";');

    this.addSql('alter table "content_attachments" drop constraint "content_attachments_content_id_foreign";');

    this.addSql('alter table "content_teams" drop constraint "content_teams_content_id_foreign";');

    this.addSql('alter table "report" drop constraint "report_content_id_foreign";');

    this.addSql('alter table "favorite" drop constraint "favorite_content_id_foreign";');

    this.addSql('alter table "validation" drop constraint "validation_content_id_foreign";');

    this.addSql('alter table "vote" drop constraint "vote_content_id_foreign";');

    this.addSql('alter table "log" drop constraint "log_content_master_id_foreign";');

    this.addSql('alter table "issue" drop constraint "issue_content_master_id_foreign";');

    this.addSql('alter table "content_master_tags" drop constraint "content_master_tags_content_master_id_foreign";');

    this.addSql('alter table "content_master_contributors" drop constraint "content_master_contributors_content_master_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_content_master_id_foreign";');

    this.addSql('alter table "expense" drop constraint "expense_issue_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_cohort_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_class_group_id_foreign";');

    this.addSql('alter table "subject_class_groups" drop constraint "subject_class_groups_class_group_id_foreign";');

    this.addSql('alter table "class_group_teacher" drop constraint "class_group_teacher_class_group_id_foreign";');

    this.addSql('alter table "form_submission" drop constraint "form_submission_form_edit_id_foreign";');

    this.addSql('alter table "form_submission_edit" drop constraint "form_submission_edit_form_submission_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_approval_submission_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_form_submission_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_form_submission_id_foreign";');

    this.addSql('alter table "document_edit" drop constraint "document_edit_document_id_foreign";');

    this.addSql('alter table "actor_address" drop constraint "actor_address_campus_id_foreign";');

    this.addSql('alter table "social" drop constraint "social_actor_id_foreign";');

    this.addSql('alter table "shortcut" drop constraint "shortcut_target_actor_id_foreign";');

    this.addSql('alter table "report" drop constraint "report_actor_id_foreign";');

    this.addSql('alter table "follow" drop constraint "follow_followed_actor_id_foreign";');

    this.addSql('alter table "favorite" drop constraint "favorite_actor_id_foreign";');

    this.addSql('alter table "bot_info" drop constraint "bot_info_owner_id_foreign";');

    this.addSql('alter table "actor_image" drop constraint "actor_image_actor_id_foreign";');

    this.addSql('alter table "actor_address" drop constraint "actor_address_actor_id_foreign";');

    this.addSql('alter table "actor_bank_info" drop constraint "actor_bank_info_actor_id_foreign";');

    this.addSql('alter table "actor_finance" drop constraint "actor_finance_payed_by_id_foreign";');

    this.addSql('alter table "actor_tags" drop constraint "actor_tags_actor_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_payed_by_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_bot_id_foreign";');

    this.addSql('alter table "actor_bank_info" drop constraint "actor_bank_info_address_id_foreign";');

    this.addSql('alter table "actor_finance" drop constraint "actor_finance_address_id_foreign";');

    this.addSql('alter table "event" drop constraint "event_address_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_address_id_foreign";');

    this.addSql('alter table "expense" drop constraint "expense_bank_info_id_foreign";');

    this.addSql('alter table "actor_finance" drop constraint "actor_finance_expense_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_expense_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_event_id_foreign";');

    this.addSql('alter table "team_events" drop constraint "team_events_event_id_foreign";');

    this.addSql('alter table "event_role" drop constraint "event_role_event_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_event_id_foreign";');

    this.addSql('alter table "event_tags" drop constraint "event_tags_event_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_event_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_event_id_foreign";');

    this.addSql('alter table "event_change_role" drop constraint "event_change_role_received_role_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_event_role_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_event_change_role_id_foreign";');

    this.addSql('alter table "class_group_teacher_subjects" drop constraint "class_group_teacher_subjects_class_group_teacher_id_foreign";');

    this.addSql('alter table "team_join" drop constraint "team_join_change_role_id_foreign";');

    this.addSql('alter table "event_join" drop constraint "event_join_action_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_event_join_id_foreign";');

    this.addSql('alter table "event_attendance" drop constraint "event_attendance_event_join_id_foreign";');

    this.addSql('drop table if exists "user_info" cascade;');

    this.addSql('drop table if exists "canteen" cascade;');

    this.addSql('drop table if exists "tenant" cascade;');

    this.addSql('drop table if exists "team" cascade;');

    this.addSql('drop table if exists "individual" cascade;');

    this.addSql('drop table if exists "team_metric" cascade;');

    this.addSql('drop table if exists "team_member" cascade;');

    this.addSql('drop table if exists "subject" cascade;');

    this.addSql('drop table if exists "session" cascade;');

    this.addSql('drop table if exists "role" cascade;');

    this.addSql('drop table if exists "team_member_roles" cascade;');

    this.addSql('drop table if exists "pole" cascade;');

    this.addSql('drop table if exists "form" cascade;');

    this.addSql('drop table if exists "file_upload" cascade;');

    this.addSql('drop table if exists "tag" cascade;');

    this.addSql('drop table if exists "project" cascade;');

    this.addSql('drop table if exists "project_role" cascade;');

    this.addSql('drop table if exists "project_tags" cascade;');

    this.addSql('drop table if exists "project_supervisors" cascade;');

    this.addSql('drop table if exists "event_approval_step" cascade;');

    this.addSql('drop table if exists "event_approval_step_validators" cascade;');

    this.addSql('drop table if exists "event_approval_step_notifiees" cascade;');

    this.addSql('drop table if exists "content" cascade;');

    this.addSql('drop table if exists "reaction" cascade;');

    this.addSql('drop table if exists "content_master" cascade;');

    this.addSql('drop table if exists "log" cascade;');

    this.addSql('drop table if exists "issue" cascade;');

    this.addSql('drop table if exists "content_master_tags" cascade;');

    this.addSql('drop table if exists "content_master_contributors" cascade;');

    this.addSql('drop table if exists "content_attachments" cascade;');

    this.addSql('drop table if exists "cohort" cascade;');

    this.addSql('drop table if exists "class_group" cascade;');

    this.addSql('drop table if exists "subject_class_groups" cascade;');

    this.addSql('drop table if exists "form_edit" cascade;');

    this.addSql('drop table if exists "form_submission" cascade;');

    this.addSql('drop table if exists "form_submission_edit" cascade;');

    this.addSql('drop table if exists "document" cascade;');

    this.addSql('drop table if exists "document_edit" cascade;');

    this.addSql('drop table if exists "content_teams" cascade;');

    this.addSql('drop table if exists "canteen_menu" cascade;');

    this.addSql('drop table if exists "canteen_food" cascade;');

    this.addSql('drop table if exists "campus" cascade;');

    this.addSql('drop table if exists "actor" cascade;');

    this.addSql('drop table if exists "social" cascade;');

    this.addSql('drop table if exists "shortcut" cascade;');

    this.addSql('drop table if exists "report" cascade;');

    this.addSql('drop table if exists "follow" cascade;');

    this.addSql('drop table if exists "favorite" cascade;');

    this.addSql('drop table if exists "bot_info" cascade;');

    this.addSql('drop table if exists "actor_image" cascade;');

    this.addSql('drop table if exists "actor_address" cascade;');

    this.addSql('drop table if exists "actor_bank_info" cascade;');

    this.addSql('drop table if exists "expense" cascade;');

    this.addSql('drop table if exists "actor_finance" cascade;');

    this.addSql('drop table if exists "actor_tags" cascade;');

    this.addSql('drop table if exists "event" cascade;');

    this.addSql('drop table if exists "team_finance" cascade;');

    this.addSql('drop table if exists "team_events" cascade;');

    this.addSql('drop table if exists "event_role" cascade;');

    this.addSql('drop table if exists "event_change_role" cascade;');

    this.addSql('drop table if exists "event_approval" cascade;');

    this.addSql('drop table if exists "event_tags" cascade;');

    this.addSql('drop table if exists "class_group_teacher" cascade;');

    this.addSql('drop table if exists "class_group_teacher_subjects" cascade;');

    this.addSql('drop table if exists "change_role" cascade;');

    this.addSql('drop table if exists "team_join" cascade;');

    this.addSql('drop table if exists "action" cascade;');

    this.addSql('drop table if exists "event_join" cascade;');

    this.addSql('drop table if exists "event_attendance" cascade;');

    this.addSql('drop table if exists "validation" cascade;');

    this.addSql('drop table if exists "vote" cascade;');
  }

}
