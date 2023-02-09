import { Migration } from '@mikro-orm/migrations';

export class Migration20230208223743 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "tenant_core" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "domain" text not null, "name" text not null, "oidc_info_oidc_enabled" boolean not null, "oidc_info_oidc_name" text null, "oidc_info_oidc_client_id" text null, "oidc_info_oidc_client_secret" text null, "oidc_info_oidc_discovery_url" text null, "oidc_info_oidc_scopes" text null, "oidc_info_oidc_callback_uri" text null);');
    this.addSql('alter table "tenant_core" add constraint "tenant_core_domain_unique" unique ("domain");');

    this.addSql('create table "subject" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "name" text not null, "english_name" text null, "code" text not null, "description" text null, "type" text check ("type" in (\'Mathematics\', \'Physics\', \'English\', \'Communication\', \'Programming\')) not null, "last_active_date" timestamptz(0) null);');
    this.addSql('create index "subject_code_index" on "subject" ("code");');

    this.addSql('create table "org_metric" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "value" text not null, "type" text check ("type" in (\'MemberInOrgAndChildrenCount\', \'MemberInOrgAndChildrenUniqueCount\', \'MemberInOrgAndChildrenUniqueCount\', \'EventOccuringCount\', \'EventCreatedCount\', \'EventOccuringCount\', \'EventCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ContentCreatedCount\', \'ContentCreatedCount\', \'ChildOrgCount\')) not null);');

    this.addSql('create table "actor" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "slug" text not null, "name" text not null, "bio" text not null, "primary_email" text null, "ical" text not null);');
    this.addSql('alter table "actor" add constraint "actor_ical_unique" unique ("ical");');

    this.addSql('create table "social" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "actor_id" bigint not null, "type" text check ("type" in (\'Discord\', \'Instagram\', \'YouTube\', \'TikTok\', \'Twitch\', \'LinkedIn\')) not null, "url" text not null, "pseudo" text not null);');

    this.addSql('create table "user_profile" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "customization_color" text check ("customization_color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\', \'Black\')) null, "customization_signature" text null, "stats_points" int not null, "stats_post_count" smallint not null, "stats_last_post_at" timestamptz(0) null, "stats_post_streak" smallint not null, "stats_reply_count" smallint not null, "stats_last_reply_at" timestamptz(0) null, "stats_reply_streak" smallint not null, "stats_comment_count" smallint not null, "stats_last_comment" timestamptz(0) null, "stats_upload_count" smallint not null, "stats_last_action_at" timestamptz(0) null, "stats_action_streak" smallint not null, "settings_dark_mode_activated" boolean not null, "settings_gdpr_end_of_life_export" boolean not null, "settings_gdpr_end_of_life_anonymize" boolean not null, "notification_settings_notification_mentionned" smallint not null, "notification_settings_notification_badge_unlocked" smallint not null, "notification_settings_notification_blog_subscribed_updated" smallint not null, "notification_settings_notification_content_removed" smallint not null, "notification_settings_notification_admin_report_created" smallint not null, "notification_settings_notification_event_created" smallint not null, "notification_settings_notification_team_subscribed_event_created" smallint not null, "notification_settings_notification_team_managed_form_updated" smallint not null, "notification_settings_notification_team_managed_event_updated" smallint not null, "notification_settings_notification_team_managed_membership_request_updated" smallint not null, "notification_settings_notification_team_managed_member_role_updated" smallint not null, "notification_settings_notification_admin_team_social_updated" smallint not null, "notification_settings_notification_admin_team_legal_file_updated" smallint not null, "notification_settings_notification_event_subscribed_updated" smallint not null, "notification_settings_notification_event_managed_approved" smallint not null, "notification_settings_notification_event_managed_rejected" smallint not null, "notification_settings_notification_event_managed_registration_created" smallint not null, "notification_settings_notification_admin_event_validation_started" smallint not null, "notification_settings_notification_admin_event_validation_step" smallint not null, "notification_settings_notification_admin_event_validation_approved" smallint not null, "notification_settings_notification_admin_event_validation_rejected" smallint not null, "notification_settings_notification_thread_subscribed_updated" smallint not null, "notification_settings_notification_thread_subscribed_answered" smallint not null, "notification_settings_notification_admin_thread_stale" smallint not null, "notification_settings_notification_admin_thread_stale_threshold" int not null, "notification_settings_notification_admin_thread_assigned_stale" smallint not null, "notification_settings_notification_admin_thread_assigned_stale_threshold" int not null, "notification_settings_notification_admin_thread_assigned" smallint not null, "notification_settings_notification_role_updated" smallint not null, "notification_settings_notification_admin_role_updated" smallint not null, "finished_introduction" boolean not null, "finished_onboarding" boolean not null);');

    this.addSql('create table "individual" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "actor_id" bigint not null, "individual_kind" text check ("individual_kind" in (\'Bot\', \'User\')) not null, "token_hash" text null, "owner_id" bigint null, "bot_role" text check ("bot_role" in (\'Official\', \'Admin\', \'Moderator\', \'User\', \'Team\')) null, "first_name" text null, "middle_names" text[] null, "last_name" text null, "password_hash" text null, "roles" text[] null default \'{User}\', "scope_role" text check ("scope_role" in (\'Student\', \'Teacher\', \'Admin\')) null, "profile_id" bigint null);');
    this.addSql('alter table "individual" add constraint "individual_actor_id_unique" unique ("actor_id");');
    this.addSql('create index "individual_individual_kind_index" on "individual" ("individual_kind");');
    this.addSql('alter table "individual" add constraint "individual_profile_id_unique" unique ("profile_id");');

    this.addSql('create table "shortcut" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "type" text check ("type" in (\'General\', \'Team\', \'TeamManage\', \'TeamManageTreasury\', \'Project\', \'User\')) not null, "user_id" bigint not null, "target_actor_id" bigint not null);');

    this.addSql('create table "session" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "ip" varchar(255) not null, "country" varchar(255) not null, "client_type" text check ("client_type" in (\'WebClient\', \'MobileClient\', \'DesktopClient\')) not null, "user_agent" jsonb not null, "refresh_token_hash" varchar(255) not null, "token_family" varchar(255) not null, "user_id" bigint not null, "last_activity_at" timestamptz(0) not null, "last_issued_at" timestamptz(0) not null, "revoked_at" timestamptz(0) null, "expired_at" timestamptz(0) null);');

    this.addSql('create table "file_upload" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "file_upload_kind" text check ("file_upload_kind" in (\'ImageUpload\', \'DocumentUpload\', \'VideoUpload\', \'FileUpload\')) not null, "uploaded_by_id" bigint not null, "name" text not null, "size" int not null, "mime" text not null, "url" text not null, "last_modified_at" timestamptz(0) not null, "number_of_pages" smallint null, "number_of_words" int null, "document_type" text check ("document_type" in (\'Slideshow\', \'CSVLike\', \'Spreadsheet\', \'Code\', \'Markdown\', \'Text\', \'Document\')) null, "duration" int null, "width" smallint null, "height" smallint null);');
    this.addSql('create index "file_upload_file_upload_kind_index" on "file_upload" ("file_upload_kind");');

    this.addSql('create table "tag" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "tag_kind" text check ("tag_kind" in (\'TeamCategory\', \'Tag\')) not null, "name" text not null, "slug" text not null, "description" text null, "color" text check ("color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\', \'Black\')) not null, "created_by_id" bigint null, "icon_image_id" bigint null);');
    this.addSql('create index "tag_tag_kind_index" on "tag" ("tag_kind");');

    this.addSql('create table "actor_tags" ("actor_id" bigint not null, "tag_id" bigint not null, constraint "actor_tags_pkey" primary key ("actor_id", "tag_id"));');

    this.addSql('create table "actor_image" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "actor_id" bigint not null, "image_id" bigint not null, "type" text check ("type" in (\'Avatar\', \'AvatarDarkMode\', \'Banner\', \'Profile\')) not null, "last_active_date" timestamptz(0) null);');
    this.addSql('alter table "actor_image" add constraint "actor_image_image_id_unique" unique ("image_id");');

    this.addSql('create table "content_master" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "content_master_kind" text check ("content_master_kind" in (\'TenantEvent\')) not null, "slug" text not null, "title" text not null, "root_content_id" bigint not null, "start" timestamptz(0) null, "end" timestamptz(0) null, "price" real null, "image_id" bigint null, "location_name" text null, "location_latitude" real null, "location_longitude" real null, "location_street" text null, "location_city" text null, "location_zip" int null, "location_state" text null, "location_country" text null, "state" text check ("state" in (\'Template\', \'Draft\', \'Submitted\', \'Rejected\', \'Approved\', \'Published\')) null default \'Draft\', "meta" jsonb null, "supervisor_id" bigint null, "private" boolean null, "join_form_id" bigint null, "regular_event_id" bigint null, "regular_event_interval" text null, "approval_submission_id" bigint null, "last_event_approval_step_id" bigint null);');
    this.addSql('create index "content_master_content_master_kind_index" on "content_master" ("content_master_kind");');
    this.addSql('alter table "content_master" add constraint "content_master_root_content_id_unique" unique ("root_content_id");');
    this.addSql('alter table "content_master" add constraint "content_master_image_id_unique" unique ("image_id");');
    this.addSql('create index "content_master_private_index" on "content_master" ("private");');
    this.addSql('alter table "content_master" add constraint "content_master_join_form_id_unique" unique ("join_form_id");');
    this.addSql('alter table "content_master" add constraint "content_master_approval_submission_id_unique" unique ("approval_submission_id");');

    this.addSql('create table "ugc" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "ugc_kind" text check ("ugc_kind" in (\'Content\', \'TenantDocument\', \'Form\', \'FormSubmission\')) not null, "text" text not null, "author_id" bigint not null, "real_author_id" bigint not null, "is_anonymous" boolean not null, "representing_org_id" bigint null, "content_master_id" bigint null, "upvote_count" int not null, "downvote_count" int not null, "total_vote_count" int not null, "report_count" int not null, "favorite_count" int not null, "comment_count" int not null, "parent_id" bigint null, "document_kind" text check ("document_kind" in (\'InfoDocument\', \'StudyDocument\', \'Document\')) null, "document_upload_id" bigint null, "year_version" smallint null, "name" text null, "description" text null, "schema" jsonb null, "type" text check ("type" in (\'EventRegistration\', \'MembershipRequest\', \'Internal\', \'Survey\')) null, "is_template" boolean null, "submission" jsonb null, "for_form_id" bigint null);');
    this.addSql('create index "ugc_ugc_kind_index" on "ugc" ("ugc_kind");');
    this.addSql('alter table "ugc" add constraint "ugc_document_upload_id_unique" unique ("document_upload_id");');

    this.addSql('create table "ugc_attachments" ("ugc_id" bigint not null, "file_upload_id" bigint not null, constraint "ugc_attachments_pkey" primary key ("ugc_id", "file_upload_id"));');

    this.addSql('create table "org" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "org_kind" text check ("org_kind" in (\'Canteen\', \'ClassGroup\', \'Cohort\', \'Team\', \'Tenant\')) not null, "actor_id" bigint not null, "parent_id" bigint null, "description" text null, "year" smallint null, "logo_id" bigint null, "tagline" text null, "type" text check ("type" in (\'Association\', \'Club\', \'Project\', \'Department\')) null default \'Project\', "video_id" bigint null, "membership_fees" int null, "current_finance" int null, "member_count" int null, "join_form_id" bigint null, "directors_category_name" text null, "managers_category_name" text null, "members_category_name" text null, "event_validation_form_id" bigint null);');
    this.addSql('create index "org_org_kind_index" on "org" ("org_kind");');
    this.addSql('alter table "org" add constraint "org_actor_id_unique" unique ("actor_id");');
    this.addSql('alter table "org" add constraint "org_logo_id_unique" unique ("logo_id");');
    this.addSql('alter table "org" add constraint "org_video_id_unique" unique ("video_id");');
    this.addSql('alter table "org" add constraint "org_join_form_id_unique" unique ("join_form_id");');
    this.addSql('alter table "org" add constraint "org_event_validation_form_id_unique" unique ("event_validation_form_id");');

    this.addSql('create table "teach_class" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "user_id" bigint not null, "class_group_id" bigint not null, "start_date" timestamptz(0) not null, "end_date" timestamptz(0) null);');

    this.addSql('create table "teach_class_subject" ("teach_class_id" bigint not null, "subject_id" bigint not null, constraint "teach_class_subject_pkey" primary key ("teach_class_id", "subject_id"));');

    this.addSql('create table "tag_teams" ("tag_id" bigint not null, "org_id" bigint not null, constraint "tag_teams_pkey" primary key ("tag_id", "org_id"));');

    this.addSql('create table "subject_linked_classes" ("subject_id" bigint not null, "org_id" bigint not null, constraint "subject_linked_classes_pkey" primary key ("subject_id", "org_id"));');

    this.addSql('create table "role" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "role_kind" text check ("role_kind" in (\'TeamRole\', \'CanteenRole\')) not null, "name" text not null, "color" text check ("color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\', \'Black\')) not null, "required" boolean not null, "canteen_id" bigint null, "team_id" bigint null, "permissions" text[] null default \'{}\', "category" text check ("category" in (\'Directors\', \'Managers\', \'Members\')) null, "key" text check ("key" in (\'Director\', \'Treasurer\', \'Secretary\')) null);');
    this.addSql('create index "role_role_kind_index" on "role" ("role_kind");');

    this.addSql('create table "org_document" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "org_id" bigint not null, "document_id" bigint not null, "type" text check ("type" in (\'TenantGuide\', \'AssociationConstitution\', \'AssociationDeclaration\', \'ClubHandover\', \'ClubCharter\', \'OrgMeetingTranscript\', \'OrgGraphicCharter\')) not null);');

    this.addSql('create table "org_categories" ("org_id" bigint not null, "tag_id" bigint not null, constraint "org_categories_pkey" primary key ("org_id", "tag_id"));');

    this.addSql('create table "membership" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "membership_kind" text check ("membership_kind" in (\'CanteenMember\', \'ClassGroupMember\', \'CohortMember\', \'TeamMember\', \'TenantMember\')) not null, "user_id" bigint not null, "start_date" timestamptz(0) not null, "end_date" timestamptz(0) null, "canteen_id" bigint null, "class_group_id" bigint null, "cohort_id" bigint null, "team_id" bigint null);');
    this.addSql('create index "membership_membership_kind_index" on "membership" ("membership_kind");');

    this.addSql('create table "membership_roles" ("membership_id" bigint not null, "role_id" bigint not null, constraint "membership_roles_pkey" primary key ("membership_id", "role_id"));');

    this.addSql('create table "membership_canteen_roles" ("membership_id" bigint not null, "role_id" bigint not null, constraint "membership_canteen_roles_pkey" primary key ("membership_id", "role_id"));');

    this.addSql('create table "event_approval_step" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "tenant_org_id" bigint not null, "created_by_id" bigint null, "order" int not null, "name" varchar(255) not null);');

    this.addSql('create table "event_approval_step_validators" ("event_approval_step_id" bigint not null, "individual_id" bigint not null, constraint "event_approval_step_validators_pkey" primary key ("event_approval_step_id", "individual_id"));');

    this.addSql('create table "event_approval_step_notifiees" ("event_approval_step_id" bigint not null, "individual_id" bigint not null, constraint "event_approval_step_notifiees_pkey" primary key ("event_approval_step_id", "individual_id"));');

    this.addSql('create table "form_submission_edit" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "added_diff" jsonb not null, "order" smallint not null, "form_submission_id" bigint not null, "edited_by_id" bigint not null);');

    this.addSql('create table "form_edit" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "added_diff" jsonb not null, "order" smallint not null, "form_id" bigint not null, "edited_by_id" bigint not null);');

    this.addSql('create table "document_edit" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "document_upload_id" bigint not null, "order" smallint not null, "edited_by_id" bigint not null, "linked_document_id" bigint not null, "year_version" smallint null);');

    this.addSql('create table "project" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "name" text not null, "description" text null, "expected_budget" int not null, "actual_budget" int null, "team_id" bigint not null, "linked_event_id" bigint null, "created_by_id" bigint not null, "supervisor_id" bigint not null);');

    this.addSql('create table "team_action" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "team_id" bigint not null, "user_id" bigint not null, "team_member_id" bigint null, "name" text not null, "description" text null, "score" int not null, "linked_event_id" bigint null, "linked_project_id" bigint null, "created_by_id" bigint not null, "supervisor_id" bigint not null);');

    this.addSql('create table "project_participants" ("project_id" bigint not null, "individual_id" bigint not null, constraint "project_participants_pkey" primary key ("project_id", "individual_id"));');

    this.addSql('create table "join" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "join_kind" text check ("join_kind" in (\'EventJoin\', \'TeamJoin\')) not null, "issuer_id" bigint null, "joiner_id" bigint not null, "validated_by_id" bigint null, "validated_at" timestamptz(0) null, "validation_message" text null, "form_submission_id" bigint null, "state" text check ("state" in (\'Pending\', \'Approved\', \'Rejected\')) not null default \'Pending\', "event_id" bigint null, "participated" boolean null, "team_action_id" bigint null, "presence_status" text check ("presence_status" in (\'Sure\', \'Maybe\', \'Absent\')) null, "team_id" bigint null, "asked_role_id" bigint null, "received_role_id" bigint null);');
    this.addSql('create index "join_join_kind_index" on "join" ("join_kind");');
    this.addSql('alter table "join" add constraint "join_issuer_id_unique" unique ("issuer_id");');
    this.addSql('alter table "join" add constraint "join_joiner_id_unique" unique ("joiner_id");');
    this.addSql('alter table "join" add constraint "join_validated_by_id_unique" unique ("validated_by_id");');

    this.addSql('create table "interaction" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "interaction_kind" text check ("interaction_kind" in (\'Favorite\', \'Reaction\', \'Report\', \'Validation\', \'Vote\')) not null, "content_id" bigint not null, "linked_content_master_id" bigint null, "actor_id" bigint not null, "reaction_type" text check ("reaction_type" in (\'What\', \'Interesting\', \'Like\', \'NotAnIssue\', \'Bump\', \'Laugh\', \'Unsure\', \'Partial\', \'Perfect\')) null, "target_id" bigint null, "reason" text null, "last_active_date" timestamptz(0) null, "type" jsonb null, "value" smallint null);');
    this.addSql('create index "interaction_interaction_kind_index" on "interaction" ("interaction_kind");');
    this.addSql('create index "interaction_reaction_type_index" on "interaction" ("reaction_type");');

    this.addSql('create table "finance" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "transaction" text not null, "description" text null, "payment_date" timestamptz(0) not null, "payment_method" text check ("payment_method" in (\'Cash\', \'CreditCard\', \'Transfer\', \'RegularTransfer\', \'Check\', \'MobilePayment\', \'Other\')) not null, "address_name" text null, "address_latitude" real null, "address_longitude" real null, "address_street" text null, "address_city" text null, "address_zip" int null, "address_state" text null, "address_country" text null, "amount_due" real not null, "amount_payed" real not null, "state" text check ("state" in (\'Canceled\', \'Ongoing\', \'Completed\')) not null, "category" text check ("category" in (\'Entertainment\', \'Equipement\', \'Errands\', \'Fees\', \'MembershipFees\', \'Insurance\', \'Logistics\', \'Marketing\', \'Provider\', \'Subscriptions\', \'Transportation\', \'Other\')) not null, "team_id" bigint not null, "created_by_id" bigint not null, "payed_by_id" bigint null, "linked_event_id" bigint null, "linked_project_id" bigint null);');

    this.addSql('create table "finance_receipts" ("finance_id" bigint not null, "file_upload_id" bigint not null, constraint "finance_receipts_pkey" primary key ("finance_id", "file_upload_id"));');

    this.addSql('create table "event_approval" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "event_id" bigint null, "created_by_id" bigint null, "message" text null, "approved" boolean not null, "step_id" bigint null);');

    this.addSql('create table "content_master_tags" ("content_master_id" bigint not null, "tag_id" bigint not null, constraint "content_master_tags_pkey" primary key ("content_master_id", "tag_id"));');

    this.addSql('create table "content_edit" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "tenant_id" bigint not null, "last_hidden_at" timestamptz(0) null, "added_diff" jsonb not null, "note" text null, "order" smallint not null, "content_id" bigint not null, "edited_by_id" bigint not null);');

    this.addSql('create table "content_master_contributors" ("content_master_id" bigint not null, "individual_id" bigint not null, constraint "content_master_contributors_pkey" primary key ("content_master_id", "individual_id"));');

    this.addSql('alter table "subject" add constraint "subject_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');

    this.addSql('alter table "org_metric" add constraint "org_metric_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');

    this.addSql('alter table "actor" add constraint "actor_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');

    this.addSql('alter table "social" add constraint "social_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "social" add constraint "social_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "user_profile" add constraint "user_profile_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');

    this.addSql('alter table "individual" add constraint "individual_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "individual" add constraint "individual_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade;');
    this.addSql('alter table "individual" add constraint "individual_owner_id_foreign" foreign key ("owner_id") references "actor" ("id") on update cascade on delete set null;');
    this.addSql('alter table "individual" add constraint "individual_profile_id_foreign" foreign key ("profile_id") references "user_profile" ("id") on update cascade on delete set null;');

    this.addSql('alter table "shortcut" add constraint "shortcut_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "shortcut" add constraint "shortcut_user_id_foreign" foreign key ("user_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "shortcut" add constraint "shortcut_target_actor_id_foreign" foreign key ("target_actor_id") references "actor" ("id") on update cascade;');

    this.addSql('alter table "session" add constraint "session_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "individual" ("id") on update cascade;');

    this.addSql('alter table "file_upload" add constraint "file_upload_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "file_upload" add constraint "file_upload_uploaded_by_id_foreign" foreign key ("uploaded_by_id") references "individual" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "tag" add constraint "tag_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "tag" add constraint "tag_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "tag" add constraint "tag_icon_image_id_foreign" foreign key ("icon_image_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "actor_tags" add constraint "actor_tags_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "actor_tags" add constraint "actor_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "actor_image" add constraint "actor_image_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "actor_image" add constraint "actor_image_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "actor_image" add constraint "actor_image_image_id_foreign" foreign key ("image_id") references "file_upload" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "content_master" add constraint "content_master_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "content_master" add constraint "content_master_root_content_id_foreign" foreign key ("root_content_id") references "ugc" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content_master" add constraint "content_master_image_id_foreign" foreign key ("image_id") references "file_upload" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master" add constraint "content_master_supervisor_id_foreign" foreign key ("supervisor_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content_master" add constraint "content_master_join_form_id_foreign" foreign key ("join_form_id") references "ugc" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master" add constraint "content_master_regular_event_id_foreign" foreign key ("regular_event_id") references "content_master" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content_master" add constraint "content_master_approval_submission_id_foreign" foreign key ("approval_submission_id") references "ugc" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content_master" add constraint "content_master_last_event_approval_step_id_foreign" foreign key ("last_event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete set null;');

    this.addSql('alter table "ugc" add constraint "ugc_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "ugc" add constraint "ugc_author_id_foreign" foreign key ("author_id") references "individual" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "ugc" add constraint "ugc_real_author_id_foreign" foreign key ("real_author_id") references "individual" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "ugc" add constraint "ugc_representing_org_id_foreign" foreign key ("representing_org_id") references "org" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "ugc" add constraint "ugc_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete set null;');
    this.addSql('alter table "ugc" add constraint "ugc_parent_id_foreign" foreign key ("parent_id") references "ugc" ("id") on update cascade on delete set null;');
    this.addSql('alter table "ugc" add constraint "ugc_document_upload_id_foreign" foreign key ("document_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "ugc" add constraint "ugc_for_form_id_foreign" foreign key ("for_form_id") references "ugc" ("id") on update cascade on delete set null;');

    this.addSql('alter table "ugc_attachments" add constraint "ugc_attachments_ugc_id_foreign" foreign key ("ugc_id") references "ugc" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "ugc_attachments" add constraint "ugc_attachments_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "org" add constraint "org_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "org" add constraint "org_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade;');
    this.addSql('alter table "org" add constraint "org_parent_id_foreign" foreign key ("parent_id") references "org" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "org" add constraint "org_logo_id_foreign" foreign key ("logo_id") references "file_upload" ("id") on update cascade on delete set null;');
    this.addSql('alter table "org" add constraint "org_video_id_foreign" foreign key ("video_id") references "file_upload" ("id") on update cascade on delete set null;');
    this.addSql('alter table "org" add constraint "org_join_form_id_foreign" foreign key ("join_form_id") references "ugc" ("id") on update cascade on delete set null;');
    this.addSql('alter table "org" add constraint "org_event_validation_form_id_foreign" foreign key ("event_validation_form_id") references "ugc" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "teach_class" add constraint "teach_class_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "teach_class" add constraint "teach_class_user_id_foreign" foreign key ("user_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "teach_class" add constraint "teach_class_class_group_id_foreign" foreign key ("class_group_id") references "org" ("id") on update cascade;');

    this.addSql('alter table "teach_class_subject" add constraint "teach_class_subject_teach_class_id_foreign" foreign key ("teach_class_id") references "teach_class" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "teach_class_subject" add constraint "teach_class_subject_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "tag_teams" add constraint "tag_teams_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "tag_teams" add constraint "tag_teams_org_id_foreign" foreign key ("org_id") references "org" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "subject_linked_classes" add constraint "subject_linked_classes_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "subject_linked_classes" add constraint "subject_linked_classes_org_id_foreign" foreign key ("org_id") references "org" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "role" add constraint "role_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "role" add constraint "role_canteen_id_foreign" foreign key ("canteen_id") references "org" ("id") on update cascade on delete set null;');
    this.addSql('alter table "role" add constraint "role_team_id_foreign" foreign key ("team_id") references "org" ("id") on update cascade on delete set null;');

    this.addSql('alter table "org_document" add constraint "org_document_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "org_document" add constraint "org_document_org_id_foreign" foreign key ("org_id") references "org" ("id") on update cascade;');
    this.addSql('alter table "org_document" add constraint "org_document_document_id_foreign" foreign key ("document_id") references "ugc" ("id") on update cascade;');

    this.addSql('alter table "org_categories" add constraint "org_categories_org_id_foreign" foreign key ("org_id") references "org" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "org_categories" add constraint "org_categories_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "membership" add constraint "membership_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "membership" add constraint "membership_user_id_foreign" foreign key ("user_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "membership" add constraint "membership_canteen_id_foreign" foreign key ("canteen_id") references "org" ("id") on update cascade on delete set null;');
    this.addSql('alter table "membership" add constraint "membership_class_group_id_foreign" foreign key ("class_group_id") references "org" ("id") on update cascade on delete set null;');
    this.addSql('alter table "membership" add constraint "membership_cohort_id_foreign" foreign key ("cohort_id") references "org" ("id") on update cascade on delete set null;');
    this.addSql('alter table "membership" add constraint "membership_team_id_foreign" foreign key ("team_id") references "org" ("id") on update cascade on delete set null;');

    this.addSql('alter table "membership_roles" add constraint "membership_roles_membership_id_foreign" foreign key ("membership_id") references "membership" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "membership_roles" add constraint "membership_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "membership_canteen_roles" add constraint "membership_canteen_roles_membership_id_foreign" foreign key ("membership_id") references "membership" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "membership_canteen_roles" add constraint "membership_canteen_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event_approval_step" add constraint "event_approval_step_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "event_approval_step" add constraint "event_approval_step_tenant_org_id_foreign" foreign key ("tenant_org_id") references "org" ("id") on update cascade;');
    this.addSql('alter table "event_approval_step" add constraint "event_approval_step_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');

    this.addSql('alter table "event_approval_step_validators" add constraint "event_approval_step_validators_event_approval_step_id_foreign" foreign key ("event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval_step_validators" add constraint "event_approval_step_validators_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event_approval_step_notifiees" add constraint "event_approval_step_notifiees_event_approval_step_id_foreign" foreign key ("event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval_step_notifiees" add constraint "event_approval_step_notifiees_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "form_submission_edit" add constraint "form_submission_edit_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "form_submission_edit" add constraint "form_submission_edit_form_submission_id_foreign" foreign key ("form_submission_id") references "ugc" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "form_submission_edit" add constraint "form_submission_edit_edited_by_id_foreign" foreign key ("edited_by_id") references "individual" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "form_edit" add constraint "form_edit_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "form_edit" add constraint "form_edit_form_id_foreign" foreign key ("form_id") references "ugc" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "form_edit" add constraint "form_edit_edited_by_id_foreign" foreign key ("edited_by_id") references "individual" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "document_edit" add constraint "document_edit_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "document_edit" add constraint "document_edit_document_upload_id_foreign" foreign key ("document_upload_id") references "file_upload" ("id") on update cascade;');
    this.addSql('alter table "document_edit" add constraint "document_edit_edited_by_id_foreign" foreign key ("edited_by_id") references "individual" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "document_edit" add constraint "document_edit_linked_document_id_foreign" foreign key ("linked_document_id") references "ugc" ("id") on update cascade;');

    this.addSql('alter table "project" add constraint "project_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "project" add constraint "project_team_id_foreign" foreign key ("team_id") references "org" ("id") on update cascade;');
    this.addSql('alter table "project" add constraint "project_linked_event_id_foreign" foreign key ("linked_event_id") references "content_master" ("id") on update cascade on delete set null;');
    this.addSql('alter table "project" add constraint "project_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "project" add constraint "project_supervisor_id_foreign" foreign key ("supervisor_id") references "individual" ("id") on update cascade;');

    this.addSql('alter table "team_action" add constraint "team_action_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "team_action" add constraint "team_action_team_id_foreign" foreign key ("team_id") references "org" ("id") on update cascade;');
    this.addSql('alter table "team_action" add constraint "team_action_user_id_foreign" foreign key ("user_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "team_action" add constraint "team_action_team_member_id_foreign" foreign key ("team_member_id") references "membership" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_action" add constraint "team_action_linked_event_id_foreign" foreign key ("linked_event_id") references "content_master" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_action" add constraint "team_action_linked_project_id_foreign" foreign key ("linked_project_id") references "project" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_action" add constraint "team_action_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "team_action" add constraint "team_action_supervisor_id_foreign" foreign key ("supervisor_id") references "individual" ("id") on update cascade;');

    this.addSql('alter table "project_participants" add constraint "project_participants_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "project_participants" add constraint "project_participants_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "join" add constraint "join_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "join" add constraint "join_issuer_id_foreign" foreign key ("issuer_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "join" add constraint "join_joiner_id_foreign" foreign key ("joiner_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "join" add constraint "join_validated_by_id_foreign" foreign key ("validated_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "join" add constraint "join_form_submission_id_foreign" foreign key ("form_submission_id") references "ugc" ("id") on update cascade on delete set null;');
    this.addSql('alter table "join" add constraint "join_event_id_foreign" foreign key ("event_id") references "content_master" ("id") on update cascade on delete set null;');
    this.addSql('alter table "join" add constraint "join_team_action_id_foreign" foreign key ("team_action_id") references "team_action" ("id") on update cascade on delete set null;');
    this.addSql('alter table "join" add constraint "join_team_id_foreign" foreign key ("team_id") references "org" ("id") on update cascade on delete set null;');
    this.addSql('alter table "join" add constraint "join_asked_role_id_foreign" foreign key ("asked_role_id") references "role" ("id") on update cascade on delete set null;');
    this.addSql('alter table "join" add constraint "join_received_role_id_foreign" foreign key ("received_role_id") references "role" ("id") on update cascade on delete set null;');

    this.addSql('alter table "interaction" add constraint "interaction_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "interaction" add constraint "interaction_content_id_foreign" foreign key ("content_id") references "ugc" ("id") on update cascade;');
    this.addSql('alter table "interaction" add constraint "interaction_linked_content_master_id_foreign" foreign key ("linked_content_master_id") references "content_master" ("id") on update cascade on delete set null;');
    this.addSql('alter table "interaction" add constraint "interaction_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade;');
    this.addSql('alter table "interaction" add constraint "interaction_target_id_foreign" foreign key ("target_id") references "individual" ("id") on update cascade on delete set null;');

    this.addSql('alter table "finance" add constraint "finance_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "finance" add constraint "finance_team_id_foreign" foreign key ("team_id") references "org" ("id") on update cascade;');
    this.addSql('alter table "finance" add constraint "finance_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "finance" add constraint "finance_payed_by_id_foreign" foreign key ("payed_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "finance" add constraint "finance_linked_event_id_foreign" foreign key ("linked_event_id") references "content_master" ("id") on update cascade on delete set null;');
    this.addSql('alter table "finance" add constraint "finance_linked_project_id_foreign" foreign key ("linked_project_id") references "project" ("id") on update cascade on delete set null;');

    this.addSql('alter table "finance_receipts" add constraint "finance_receipts_finance_id_foreign" foreign key ("finance_id") references "finance" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "finance_receipts" add constraint "finance_receipts_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event_approval" add constraint "event_approval_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "event_approval" add constraint "event_approval_event_id_foreign" foreign key ("event_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval" add constraint "event_approval_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval" add constraint "event_approval_step_id_foreign" foreign key ("step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content_master_tags" add constraint "content_master_tags_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_tags" add constraint "content_master_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content_edit" add constraint "content_edit_tenant_id_foreign" foreign key ("tenant_id") references "tenant_core" ("id") on update cascade;');
    this.addSql('alter table "content_edit" add constraint "content_edit_content_id_foreign" foreign key ("content_id") references "ugc" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content_edit" add constraint "content_edit_edited_by_id_foreign" foreign key ("edited_by_id") references "individual" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "content_master_contributors" add constraint "content_master_contributors_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_contributors" add constraint "content_master_contributors_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "subject" drop constraint "subject_tenant_id_foreign";');

    this.addSql('alter table "org_metric" drop constraint "org_metric_tenant_id_foreign";');

    this.addSql('alter table "actor" drop constraint "actor_tenant_id_foreign";');

    this.addSql('alter table "social" drop constraint "social_tenant_id_foreign";');

    this.addSql('alter table "user_profile" drop constraint "user_profile_tenant_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_tenant_id_foreign";');

    this.addSql('alter table "shortcut" drop constraint "shortcut_tenant_id_foreign";');

    this.addSql('alter table "session" drop constraint "session_tenant_id_foreign";');

    this.addSql('alter table "file_upload" drop constraint "file_upload_tenant_id_foreign";');

    this.addSql('alter table "tag" drop constraint "tag_tenant_id_foreign";');

    this.addSql('alter table "actor_image" drop constraint "actor_image_tenant_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_tenant_id_foreign";');

    this.addSql('alter table "ugc" drop constraint "ugc_tenant_id_foreign";');

    this.addSql('alter table "org" drop constraint "org_tenant_id_foreign";');

    this.addSql('alter table "teach_class" drop constraint "teach_class_tenant_id_foreign";');

    this.addSql('alter table "role" drop constraint "role_tenant_id_foreign";');

    this.addSql('alter table "org_document" drop constraint "org_document_tenant_id_foreign";');

    this.addSql('alter table "membership" drop constraint "membership_tenant_id_foreign";');

    this.addSql('alter table "event_approval_step" drop constraint "event_approval_step_tenant_id_foreign";');

    this.addSql('alter table "form_submission_edit" drop constraint "form_submission_edit_tenant_id_foreign";');

    this.addSql('alter table "form_edit" drop constraint "form_edit_tenant_id_foreign";');

    this.addSql('alter table "document_edit" drop constraint "document_edit_tenant_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_tenant_id_foreign";');

    this.addSql('alter table "team_action" drop constraint "team_action_tenant_id_foreign";');

    this.addSql('alter table "join" drop constraint "join_tenant_id_foreign";');

    this.addSql('alter table "interaction" drop constraint "interaction_tenant_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_tenant_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_tenant_id_foreign";');

    this.addSql('alter table "content_edit" drop constraint "content_edit_tenant_id_foreign";');

    this.addSql('alter table "teach_class_subject" drop constraint "teach_class_subject_subject_id_foreign";');

    this.addSql('alter table "subject_linked_classes" drop constraint "subject_linked_classes_subject_id_foreign";');

    this.addSql('alter table "social" drop constraint "social_actor_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_actor_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_owner_id_foreign";');

    this.addSql('alter table "shortcut" drop constraint "shortcut_target_actor_id_foreign";');

    this.addSql('alter table "actor_tags" drop constraint "actor_tags_actor_id_foreign";');

    this.addSql('alter table "actor_image" drop constraint "actor_image_actor_id_foreign";');

    this.addSql('alter table "org" drop constraint "org_actor_id_foreign";');

    this.addSql('alter table "interaction" drop constraint "interaction_actor_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_profile_id_foreign";');

    this.addSql('alter table "shortcut" drop constraint "shortcut_user_id_foreign";');

    this.addSql('alter table "session" drop constraint "session_user_id_foreign";');

    this.addSql('alter table "file_upload" drop constraint "file_upload_uploaded_by_id_foreign";');

    this.addSql('alter table "tag" drop constraint "tag_created_by_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_supervisor_id_foreign";');

    this.addSql('alter table "ugc" drop constraint "ugc_author_id_foreign";');

    this.addSql('alter table "ugc" drop constraint "ugc_real_author_id_foreign";');

    this.addSql('alter table "teach_class" drop constraint "teach_class_user_id_foreign";');

    this.addSql('alter table "membership" drop constraint "membership_user_id_foreign";');

    this.addSql('alter table "event_approval_step" drop constraint "event_approval_step_created_by_id_foreign";');

    this.addSql('alter table "event_approval_step_validators" drop constraint "event_approval_step_validators_individual_id_foreign";');

    this.addSql('alter table "event_approval_step_notifiees" drop constraint "event_approval_step_notifiees_individual_id_foreign";');

    this.addSql('alter table "form_submission_edit" drop constraint "form_submission_edit_edited_by_id_foreign";');

    this.addSql('alter table "form_edit" drop constraint "form_edit_edited_by_id_foreign";');

    this.addSql('alter table "document_edit" drop constraint "document_edit_edited_by_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_created_by_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_supervisor_id_foreign";');

    this.addSql('alter table "team_action" drop constraint "team_action_user_id_foreign";');

    this.addSql('alter table "team_action" drop constraint "team_action_created_by_id_foreign";');

    this.addSql('alter table "team_action" drop constraint "team_action_supervisor_id_foreign";');

    this.addSql('alter table "project_participants" drop constraint "project_participants_individual_id_foreign";');

    this.addSql('alter table "join" drop constraint "join_issuer_id_foreign";');

    this.addSql('alter table "join" drop constraint "join_joiner_id_foreign";');

    this.addSql('alter table "join" drop constraint "join_validated_by_id_foreign";');

    this.addSql('alter table "interaction" drop constraint "interaction_target_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_created_by_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_payed_by_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_created_by_id_foreign";');

    this.addSql('alter table "content_edit" drop constraint "content_edit_edited_by_id_foreign";');

    this.addSql('alter table "content_master_contributors" drop constraint "content_master_contributors_individual_id_foreign";');

    this.addSql('alter table "tag" drop constraint "tag_icon_image_id_foreign";');

    this.addSql('alter table "actor_image" drop constraint "actor_image_image_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_image_id_foreign";');

    this.addSql('alter table "ugc" drop constraint "ugc_document_upload_id_foreign";');

    this.addSql('alter table "ugc_attachments" drop constraint "ugc_attachments_file_upload_id_foreign";');

    this.addSql('alter table "org" drop constraint "org_logo_id_foreign";');

    this.addSql('alter table "org" drop constraint "org_video_id_foreign";');

    this.addSql('alter table "document_edit" drop constraint "document_edit_document_upload_id_foreign";');

    this.addSql('alter table "finance_receipts" drop constraint "finance_receipts_file_upload_id_foreign";');

    this.addSql('alter table "actor_tags" drop constraint "actor_tags_tag_id_foreign";');

    this.addSql('alter table "tag_teams" drop constraint "tag_teams_tag_id_foreign";');

    this.addSql('alter table "org_categories" drop constraint "org_categories_tag_id_foreign";');

    this.addSql('alter table "content_master_tags" drop constraint "content_master_tags_tag_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_regular_event_id_foreign";');

    this.addSql('alter table "ugc" drop constraint "ugc_content_master_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_linked_event_id_foreign";');

    this.addSql('alter table "team_action" drop constraint "team_action_linked_event_id_foreign";');

    this.addSql('alter table "join" drop constraint "join_event_id_foreign";');

    this.addSql('alter table "interaction" drop constraint "interaction_linked_content_master_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_linked_event_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_event_id_foreign";');

    this.addSql('alter table "content_master_tags" drop constraint "content_master_tags_content_master_id_foreign";');

    this.addSql('alter table "content_master_contributors" drop constraint "content_master_contributors_content_master_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_root_content_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_join_form_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_approval_submission_id_foreign";');

    this.addSql('alter table "ugc" drop constraint "ugc_parent_id_foreign";');

    this.addSql('alter table "ugc" drop constraint "ugc_for_form_id_foreign";');

    this.addSql('alter table "ugc_attachments" drop constraint "ugc_attachments_ugc_id_foreign";');

    this.addSql('alter table "org" drop constraint "org_join_form_id_foreign";');

    this.addSql('alter table "org" drop constraint "org_event_validation_form_id_foreign";');

    this.addSql('alter table "org_document" drop constraint "org_document_document_id_foreign";');

    this.addSql('alter table "form_submission_edit" drop constraint "form_submission_edit_form_submission_id_foreign";');

    this.addSql('alter table "form_edit" drop constraint "form_edit_form_id_foreign";');

    this.addSql('alter table "document_edit" drop constraint "document_edit_linked_document_id_foreign";');

    this.addSql('alter table "join" drop constraint "join_form_submission_id_foreign";');

    this.addSql('alter table "interaction" drop constraint "interaction_content_id_foreign";');

    this.addSql('alter table "content_edit" drop constraint "content_edit_content_id_foreign";');

    this.addSql('alter table "ugc" drop constraint "ugc_representing_org_id_foreign";');

    this.addSql('alter table "org" drop constraint "org_parent_id_foreign";');

    this.addSql('alter table "teach_class" drop constraint "teach_class_class_group_id_foreign";');

    this.addSql('alter table "tag_teams" drop constraint "tag_teams_org_id_foreign";');

    this.addSql('alter table "subject_linked_classes" drop constraint "subject_linked_classes_org_id_foreign";');

    this.addSql('alter table "role" drop constraint "role_canteen_id_foreign";');

    this.addSql('alter table "role" drop constraint "role_team_id_foreign";');

    this.addSql('alter table "org_document" drop constraint "org_document_org_id_foreign";');

    this.addSql('alter table "org_categories" drop constraint "org_categories_org_id_foreign";');

    this.addSql('alter table "membership" drop constraint "membership_canteen_id_foreign";');

    this.addSql('alter table "membership" drop constraint "membership_class_group_id_foreign";');

    this.addSql('alter table "membership" drop constraint "membership_cohort_id_foreign";');

    this.addSql('alter table "membership" drop constraint "membership_team_id_foreign";');

    this.addSql('alter table "event_approval_step" drop constraint "event_approval_step_tenant_org_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_team_id_foreign";');

    this.addSql('alter table "team_action" drop constraint "team_action_team_id_foreign";');

    this.addSql('alter table "join" drop constraint "join_team_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_team_id_foreign";');

    this.addSql('alter table "teach_class_subject" drop constraint "teach_class_subject_teach_class_id_foreign";');

    this.addSql('alter table "membership_roles" drop constraint "membership_roles_role_id_foreign";');

    this.addSql('alter table "membership_canteen_roles" drop constraint "membership_canteen_roles_role_id_foreign";');

    this.addSql('alter table "join" drop constraint "join_asked_role_id_foreign";');

    this.addSql('alter table "join" drop constraint "join_received_role_id_foreign";');

    this.addSql('alter table "membership_roles" drop constraint "membership_roles_membership_id_foreign";');

    this.addSql('alter table "membership_canteen_roles" drop constraint "membership_canteen_roles_membership_id_foreign";');

    this.addSql('alter table "team_action" drop constraint "team_action_team_member_id_foreign";');

    this.addSql('alter table "content_master" drop constraint "content_master_last_event_approval_step_id_foreign";');

    this.addSql('alter table "event_approval_step_validators" drop constraint "event_approval_step_validators_event_approval_step_id_foreign";');

    this.addSql('alter table "event_approval_step_notifiees" drop constraint "event_approval_step_notifiees_event_approval_step_id_foreign";');

    this.addSql('alter table "event_approval" drop constraint "event_approval_step_id_foreign";');

    this.addSql('alter table "team_action" drop constraint "team_action_linked_project_id_foreign";');

    this.addSql('alter table "project_participants" drop constraint "project_participants_project_id_foreign";');

    this.addSql('alter table "finance" drop constraint "finance_linked_project_id_foreign";');

    this.addSql('alter table "join" drop constraint "join_team_action_id_foreign";');

    this.addSql('alter table "finance_receipts" drop constraint "finance_receipts_finance_id_foreign";');

    this.addSql('drop table if exists "tenant_core" cascade;');

    this.addSql('drop table if exists "subject" cascade;');

    this.addSql('drop table if exists "org_metric" cascade;');

    this.addSql('drop table if exists "actor" cascade;');

    this.addSql('drop table if exists "social" cascade;');

    this.addSql('drop table if exists "user_profile" cascade;');

    this.addSql('drop table if exists "individual" cascade;');

    this.addSql('drop table if exists "shortcut" cascade;');

    this.addSql('drop table if exists "session" cascade;');

    this.addSql('drop table if exists "file_upload" cascade;');

    this.addSql('drop table if exists "tag" cascade;');

    this.addSql('drop table if exists "actor_tags" cascade;');

    this.addSql('drop table if exists "actor_image" cascade;');

    this.addSql('drop table if exists "content_master" cascade;');

    this.addSql('drop table if exists "ugc" cascade;');

    this.addSql('drop table if exists "ugc_attachments" cascade;');

    this.addSql('drop table if exists "org" cascade;');

    this.addSql('drop table if exists "teach_class" cascade;');

    this.addSql('drop table if exists "teach_class_subject" cascade;');

    this.addSql('drop table if exists "tag_teams" cascade;');

    this.addSql('drop table if exists "subject_linked_classes" cascade;');

    this.addSql('drop table if exists "role" cascade;');

    this.addSql('drop table if exists "org_document" cascade;');

    this.addSql('drop table if exists "org_categories" cascade;');

    this.addSql('drop table if exists "membership" cascade;');

    this.addSql('drop table if exists "membership_roles" cascade;');

    this.addSql('drop table if exists "membership_canteen_roles" cascade;');

    this.addSql('drop table if exists "event_approval_step" cascade;');

    this.addSql('drop table if exists "event_approval_step_validators" cascade;');

    this.addSql('drop table if exists "event_approval_step_notifiees" cascade;');

    this.addSql('drop table if exists "form_submission_edit" cascade;');

    this.addSql('drop table if exists "form_edit" cascade;');

    this.addSql('drop table if exists "document_edit" cascade;');

    this.addSql('drop table if exists "project" cascade;');

    this.addSql('drop table if exists "team_action" cascade;');

    this.addSql('drop table if exists "project_participants" cascade;');

    this.addSql('drop table if exists "join" cascade;');

    this.addSql('drop table if exists "interaction" cascade;');

    this.addSql('drop table if exists "finance" cascade;');

    this.addSql('drop table if exists "finance_receipts" cascade;');

    this.addSql('drop table if exists "event_approval" cascade;');

    this.addSql('drop table if exists "content_master_tags" cascade;');

    this.addSql('drop table if exists "content_edit" cascade;');

    this.addSql('drop table if exists "content_master_contributors" cascade;');
  }

}
