import { Migration } from '@mikro-orm/migrations';

export class Migration20230624180247 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event_approval" drop constraint "event_approval_step_id_foreign";');

    this.addSql('alter table "user" add column "points" real not null default 0, add column "is_dark_mode_preferred" boolean not null default false, add column "is_data_anonymized_on_deactivation" boolean not null default false;');
    this.addSql('alter table "user" drop column "customization_color";');
    this.addSql('alter table "user" drop column "customization_signature";');
    this.addSql('alter table "user" drop column "stats_points";');
    this.addSql('alter table "user" drop column "stats_post_count";');
    this.addSql('alter table "user" drop column "stats_last_post_at";');
    this.addSql('alter table "user" drop column "stats_post_streak";');
    this.addSql('alter table "user" drop column "stats_reply_count";');
    this.addSql('alter table "user" drop column "stats_last_reply_at";');
    this.addSql('alter table "user" drop column "stats_reply_streak";');
    this.addSql('alter table "user" drop column "stats_comment_count";');
    this.addSql('alter table "user" drop column "stats_last_comment_at";');
    this.addSql('alter table "user" drop column "stats_upload_count";');
    this.addSql('alter table "user" drop column "stats_last_action_at";');
    this.addSql('alter table "user" drop column "stats_action_streak";');
    this.addSql('alter table "user" drop column "settings_is_dark_mode_activated";');
    this.addSql('alter table "user" drop column "settings_is_gdpr_anonymized_on_account_deactivation";');
    this.addSql('alter table "user" drop column "notification_settings_mentionned";');
    this.addSql('alter table "user" drop column "notification_settings_badge_unlocked";');
    this.addSql('alter table "user" drop column "notification_settings_blog_subscribed_updated";');
    this.addSql('alter table "user" drop column "notification_settings_content_removed";');
    this.addSql('alter table "user" drop column "notification_settings_admin_report_created";');
    this.addSql('alter table "user" drop column "notification_settings_event_created";');
    this.addSql('alter table "user" drop column "notification_settings_team_subscribed_event_created";');
    this.addSql('alter table "user" drop column "notification_settings_team_managed_form_updated";');
    this.addSql('alter table "user" drop column "notification_settings_team_managed_event_updated";');
    this.addSql('alter table "user" drop column "notification_settings_team_managed_membership_request_updated";');
    this.addSql('alter table "user" drop column "notification_settings_team_managed_member_role_updated";');
    this.addSql('alter table "user" drop column "notification_settings_admin_team_social_updated";');
    this.addSql('alter table "user" drop column "notification_settings_admin_team_legal_file_updated";');
    this.addSql('alter table "user" drop column "notification_settings_event_subscribed_updated";');
    this.addSql('alter table "user" drop column "notification_settings_event_managed_approved";');
    this.addSql('alter table "user" drop column "notification_settings_event_managed_rejected";');
    this.addSql('alter table "user" drop column "notification_settings_event_managed_registration_created";');
    this.addSql('alter table "user" drop column "notification_settings_admin_event_validation_started";');
    this.addSql('alter table "user" drop column "notification_settings_admin_event_validation_step";');
    this.addSql('alter table "user" drop column "notification_settings_admin_event_validation_approved";');
    this.addSql('alter table "user" drop column "notification_settings_admin_event_validation_rejected";');
    this.addSql('alter table "user" drop column "notification_settings_thread_subscribed_updated";');
    this.addSql('alter table "user" drop column "notification_settings_thread_subscribed_answered";');
    this.addSql('alter table "user" drop column "notification_settings_admin_thread_stale";');
    this.addSql('alter table "user" drop column "notification_settings_admin_thread_stale_threshold";');
    this.addSql('alter table "user" drop column "notification_settings_admin_thread_assigned_stale";');
    this.addSql('alter table "user" drop column "notification_settings_admin_thread_assigned_stale_threshold";');
    this.addSql('alter table "user" drop column "notification_settings_admin_thread_assigned";');
    this.addSql('alter table "user" drop column "notification_settings_role_updated";');
    this.addSql('alter table "user" drop column "notification_settings_admin_role_updated";');
    this.addSql('alter table "user" rename column "settings_is_gdpr_exported_on_account_deactivation" to "is_data_exported_on_deactivation";');

    this.addSql('alter table "canteen" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "canteen" alter column "description" set default \'\';');
    this.addSql('alter table "canteen" alter column "description" set not null;');

    this.addSql('alter table "tenant" alter column "oidc_info_oidc_name" type text using ("oidc_info_oidc_name"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_name" set default \'\';');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_name" set not null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_id" type text using ("oidc_info_oidc_client_id"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_id" set default \'\';');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_id" set not null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_secret" type text using ("oidc_info_oidc_client_secret"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_secret" set default \'\';');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_secret" set not null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_discovery_url" type text using ("oidc_info_oidc_discovery_url"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_discovery_url" set default \'\';');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_discovery_url" set not null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_scopes" type text using ("oidc_info_oidc_scopes"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_scopes" set default \'\';');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_scopes" set not null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_callback_uri" type text using ("oidc_info_oidc_callback_uri"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_callback_uri" set default \'\';');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_callback_uri" set not null;');

    this.addSql('alter table "individual" add column "content_signature" text not null default \'\';');

    this.addSql('alter table "project" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "project" alter column "description" set default \'\';');
    this.addSql('alter table "project" alter column "description" set not null;');

    this.addSql('alter table "class_group" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "class_group" alter column "description" set default \'\';');
    this.addSql('alter table "class_group" alter column "description" set not null;');

    this.addSql('alter table "report" alter column "reason" type text using ("reason"::text);');
    this.addSql('alter table "report" alter column "reason" set default \'\';');
    this.addSql('alter table "report" alter column "reason" set not null;');

    this.addSql('alter table "event_approval" alter column "message" type text using ("message"::text);');
    this.addSql('alter table "event_approval" alter column "message" set default \'\';');
    this.addSql('alter table "event_approval" alter column "message" set not null;');
    this.addSql('alter table "event_approval" rename column "step_id" to "event_approval_step_id";');
    this.addSql('alter table "event_approval" add constraint "event_approval_event_approval_step_id_foreign" foreign key ("event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event_approval" drop constraint "event_approval_event_approval_step_id_foreign";');

    this.addSql('alter table "user" add column "customization_color" text check ("customization_color" in (\'Blue\', \'DeepBlue\', \'DarkBlue\', \'LightBlue\', \'Green\', \'DeepGreen\', \'DarkGreen\', \'LightGreen\', \'Orange\', \'DeepOrange\', \'DarkOrange\', \'LightOrange\', \'Red\', \'DeepRed\', \'DarkRed\', \'LightRed\', \'Purple\', \'DeepPurple\', \'DarkPurple\', \'LightPurple\', \'Gray\', \'DeepGray\', \'DarkGray\', \'Turquoise\', \'Pink\', \'Cyan\', \'Brown\', \'Indigo\', \'Lime\', \'Teal\')) null default null, add column "customization_signature" text null default null, add column "stats_points" int not null default 0, add column "stats_post_count" smallint not null default 0, add column "stats_last_post_at" timestamptz(0) null default null, add column "stats_post_streak" smallint not null default 0, add column "stats_reply_count" smallint not null default 0, add column "stats_last_reply_at" timestamptz(0) null default null, add column "stats_reply_streak" smallint not null default 0, add column "stats_comment_count" smallint not null default 0, add column "stats_last_comment_at" timestamptz(0) null default null, add column "stats_upload_count" smallint not null default 0, add column "stats_last_action_at" timestamptz(0) null default null, add column "stats_action_streak" smallint not null default 0, add column "settings_is_dark_mode_activated" boolean not null default false, add column "settings_is_gdpr_anonymized_on_account_deactivation" boolean not null default false, add column "notification_settings_mentionned" smallint not null, add column "notification_settings_badge_unlocked" smallint not null, add column "notification_settings_blog_subscribed_updated" smallint not null, add column "notification_settings_content_removed" smallint not null, add column "notification_settings_admin_report_created" smallint not null, add column "notification_settings_event_created" smallint not null, add column "notification_settings_team_subscribed_event_created" smallint not null, add column "notification_settings_team_managed_form_updated" smallint not null, add column "notification_settings_team_managed_event_updated" smallint not null, add column "notification_settings_team_managed_membership_request_updated" smallint not null, add column "notification_settings_team_managed_member_role_updated" smallint not null, add column "notification_settings_admin_team_social_updated" smallint not null, add column "notification_settings_admin_team_legal_file_updated" smallint not null, add column "notification_settings_event_subscribed_updated" smallint not null, add column "notification_settings_event_managed_approved" smallint not null, add column "notification_settings_event_managed_rejected" smallint not null, add column "notification_settings_event_managed_registration_created" smallint not null, add column "notification_settings_admin_event_validation_started" smallint not null, add column "notification_settings_admin_event_validation_step" smallint not null, add column "notification_settings_admin_event_validation_approved" smallint not null, add column "notification_settings_admin_event_validation_rejected" smallint not null, add column "notification_settings_thread_subscribed_updated" smallint not null, add column "notification_settings_thread_subscribed_answered" smallint not null, add column "notification_settings_admin_thread_stale" smallint not null, add column "notification_settings_admin_thread_stale_threshold" int not null default 1209600, add column "notification_settings_admin_thread_assigned_stale" smallint not null, add column "notification_settings_admin_thread_assigned_stale_threshold" int not null default 604800, add column "notification_settings_admin_thread_assigned" smallint not null, add column "notification_settings_role_updated" smallint not null, add column "notification_settings_admin_role_updated" smallint not null;');
    this.addSql('alter table "user" drop column "points";');
    this.addSql('alter table "user" drop column "is_dark_mode_preferred";');
    this.addSql('alter table "user" drop column "is_data_anonymized_on_deactivation";');
    this.addSql('alter table "user" rename column "is_data_exported_on_deactivation" to "settings_is_gdpr_exported_on_account_deactivation";');

    this.addSql('alter table "canteen" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "canteen" alter column "description" set default null;');
    this.addSql('alter table "canteen" alter column "description" drop not null;');

    this.addSql('alter table "tenant" alter column "oidc_info_oidc_name" type text using ("oidc_info_oidc_name"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_name" set default null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_name" drop not null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_id" type text using ("oidc_info_oidc_client_id"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_id" set default null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_id" drop not null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_secret" type text using ("oidc_info_oidc_client_secret"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_secret" set default null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_client_secret" drop not null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_discovery_url" type text using ("oidc_info_oidc_discovery_url"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_discovery_url" set default null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_discovery_url" drop not null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_scopes" type text using ("oidc_info_oidc_scopes"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_scopes" set default null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_scopes" drop not null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_callback_uri" type text using ("oidc_info_oidc_callback_uri"::text);');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_callback_uri" set default null;');
    this.addSql('alter table "tenant" alter column "oidc_info_oidc_callback_uri" drop not null;');

    this.addSql('alter table "individual" drop column "content_signature";');

    this.addSql('alter table "project" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "project" alter column "description" set default null;');
    this.addSql('alter table "project" alter column "description" drop not null;');

    this.addSql('alter table "class_group" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "class_group" alter column "description" set default null;');
    this.addSql('alter table "class_group" alter column "description" drop not null;');

    this.addSql('alter table "report" alter column "reason" type text using ("reason"::text);');
    this.addSql('alter table "report" alter column "reason" set default null;');
    this.addSql('alter table "report" alter column "reason" drop not null;');

    this.addSql('alter table "event_approval" alter column "message" type text using ("message"::text);');
    this.addSql('alter table "event_approval" alter column "message" set default null;');
    this.addSql('alter table "event_approval" alter column "message" drop not null;');
    this.addSql('alter table "event_approval" rename column "event_approval_step_id" to "step_id";');
    this.addSql('alter table "event_approval" add constraint "event_approval_step_id_foreign" foreign key ("step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');
  }

}
