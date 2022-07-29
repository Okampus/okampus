import { Migration } from '@mikro-orm/migrations';

export class Migration20220729145422 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "school_year" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "active" boolean not null);');

    this.addSql('create table "food" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "nutritionals" text null, "allergens" text null, "type" smallint not null);');

    this.addSql('create table "daily_info" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "date" timestamptz(0) not null, "content" text not null);');
    this.addSql('create index "daily_info_date_index" on "daily_info" ("date");');
    this.addSql('alter table "daily_info" add constraint "daily_info_date_unique" unique ("date");');

    this.addSql('create table "daily_menu" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "date" timestamptz(0) not null);');
    this.addSql('create index "daily_menu_date_index" on "daily_menu" ("date");');
    this.addSql('alter table "daily_menu" add constraint "daily_menu_date_unique" unique ("date");');

    this.addSql('create table "daily_menu_starters" ("daily_menu_id" int not null, "food_id" int not null, constraint "daily_menu_starters_pkey" primary key ("daily_menu_id", "food_id"));');

    this.addSql('create table "daily_menu_dishes" ("daily_menu_id" int not null, "food_id" int not null, constraint "daily_menu_dishes_pkey" primary key ("daily_menu_id", "food_id"));');

    this.addSql('create table "daily_menu_desserts" ("daily_menu_id" int not null, "food_id" int not null, constraint "daily_menu_desserts_pkey" primary key ("daily_menu_id", "food_id"));');

    this.addSql('create table "doc_series" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "english_name" text null, "description" text null, "is_obsolete" boolean not null, constraint "doc_series_pkey" primary key ("id"));');

    this.addSql('create table "contact" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "icon" text not null);');

    this.addSql('create table "configuration" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, constraint "configuration_pkey" primary key ("id"));');

    this.addSql('create table "validation_step" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "configuration_id" varchar(255) not null, "step" int not null, "name" varchar(255) not null, "type" text check ("type" in (\'team-event\')) not null);');

    this.addSql('create table "badge" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "description" text not null, "point_prize" int not null, "level" smallint not null, "icon" text not null, "series" text not null, "statistic" text check ("statistic" in (\'comment\', \'post\', \'reply\', \'upload\')) not null, "statistic_threshold" int not null);');

    this.addSql('create table "wiki_page" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null, "body" text not null, "category" text not null, "hidden" boolean not null);');

    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "firstname" text not null, "lastname" text not null, "password" text null, "email" text not null, "bot" boolean not null, "reputation" int not null, "avatar" text null, "roles" text[] not null default \'{user}\', "school_role" text check ("school_role" in (\'student\', \'teacher\', \'admin\')) not null, "color" text null, "signature" text null, "banner" text null, "short_description" text null, "points" int not null, "team_event_ical" varchar(255) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('create index "user_email_index" on "user" ("email");');
    this.addSql('create index "user_team_event_ical_index" on "user" ("team_event_ical");');
    this.addSql('alter table "user" add constraint "user_team_event_ical_unique" unique ("team_event_ical");');

    this.addSql('create table "badge_unlock" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "badge_id" int not null);');
    this.addSql('create index "badge_unlock_user_id_index" on "badge_unlock" ("user_id");');

    this.addSql('create table "file_upload" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "name" text not null, "file_size" int not null, "mime_type" text not null, "file_last_modified_at" timestamptz(0) not null, "validated" boolean not null, "url" text not null, "visible" boolean not null, "file_kind" text check ("file_kind" in (\'profile-image\', \'info-doc\', \'attachment\', \'study-doc\', \'team-file\')) not null, constraint "file_upload_pkey" primary key ("id"));');

    this.addSql('create table "team" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "kind" text check ("kind" in (\'department\', \'club\')) not null, "name" text not null, "short_description" text null, "long_description" text null, "category" text not null, "tags" varchar(255) not null, "avatar" text null, "banner" text null, "membership_request_link" text null, "membership_request_message" text null, "membership_request_form_id" int null);');
    this.addSql('create index "team_kind_index" on "team" ("kind");');
    this.addSql('alter table "team" add constraint "team_membership_request_form_id_unique" unique ("membership_request_form_id");');

    this.addSql('create table "contact_account" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "kind" text check ("kind" in (\'team\', \'user\')) not null, "contact_id" int not null, "link" text null, "pseudo" text not null, "team_id" int null, "user_id" varchar(255) null);');
    this.addSql('create index "contact_account_kind_index" on "contact_account" ("kind");');
    this.addSql('create index "contact_account_team_id_index" on "contact_account" ("team_id");');
    this.addSql('create index "contact_account_user_id_index" on "contact_account" ("user_id");');

    this.addSql('create table "profile_image" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "user_id" varchar(255) null, "team_id" int null, constraint "profile_image_pkey" primary key ("id"));');
    this.addSql('alter table "profile_image" add constraint "profile_image_file_id_unique" unique ("file_id");');

    this.addSql('create table "team_file" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "team_id" int not null, "type" text check ("type" in (\'document\', \'gallery\', \'receipt\')) not null, "description" text null, constraint "team_file_pkey" primary key ("id"));');
    this.addSql('alter table "team_file" add constraint "team_file_file_id_unique" unique ("file_id");');

    this.addSql('create table "team_form" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" text null, "form" jsonb not null, "created_by_id" varchar(255) not null, "team_id" int not null, "is_template" boolean not null);');
    this.addSql('create index "team_form_team_id_index" on "team_form" ("team_id");');

    this.addSql('create table "team_event" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "name" varchar(255) not null, "description" text not null, "price" int not null, "created_by_id" varchar(255) not null, "team_id" int not null, "place" text not null, "supervisor_id" varchar(255) null, "private" boolean not null, "state" text check ("state" in (\'template\', \'draft\', \'submitted\', \'rejected\', \'published\')) not null, "validation_step" int not null, "form_id" int null, "used_template_id" int null, "meta" jsonb not null);');
    this.addSql('create index "team_event_team_id_index" on "team_event" ("team_id");');
    this.addSql('create index "team_event_private_index" on "team_event" ("private");');
    this.addSql('alter table "team_event" add constraint "team_event_form_id_unique" unique ("form_id");');

    this.addSql('create table "team_event_registration" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "event_id" int not null, "user_id" varchar(255) not null, "status" text check ("status" in (\'sure\', \'maybe\', \'notsure\')) not null, "present" boolean not null, "participation_score" int not null, "original_form_id" int null, "form_submission" jsonb null);');

    this.addSql('create table "team_event_validation" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "event_id" int not null, "user_id" varchar(255) not null, "message" text null, "approved" boolean not null, "step_id" int not null);');

    this.addSql('create table "team_finance" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "description" text null, "created_by_id" varchar(255) not null, "team_id" int not null, "due_to_id" varchar(255) null, "amount" int not null, "mean" text check ("mean" in (\'cash\', \'card\', \'transfer\', \'check\', \'other\')) not null, "type" text check ("type" in (\'expense\', \'income\')) not null, "category" smallint not null, "event_id" int null, "receipt_id" varchar(255) null);');
    this.addSql('create index "team_finance_team_id_index" on "team_finance" ("team_id");');
    this.addSql('alter table "team_finance" add constraint "team_finance_receipt_id_unique" unique ("receipt_id");');

    this.addSql('create table "team_member" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "team_id" int not null, "role" text check ("role" in (\'owner\', \'coowner\', \'treasurer\', \'secretary\', \'manager\', \'member\')) not null, "role_label" varchar(255) null, "join_date" timestamptz(0) not null);');
    this.addSql('create index "team_member_user_id_index" on "team_member" ("user_id");');
    this.addSql('create index "team_member_team_id_index" on "team_member" ("team_id");');

    this.addSql('create table "team_membership_request" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "team_id" int not null, "user_id" varchar(255) not null, "meta" jsonb null, "issuer" text check ("issuer" in (\'team\', \'user\')) not null, "state" text check ("state" in (\'pending\', \'approved\', \'rejected\')) not null, "role" text check ("role" in (\'owner\', \'coowner\', \'treasurer\', \'secretary\', \'manager\', \'member\')) not null, "handled_by_id" varchar(255) null, "handled_at" timestamptz(0) null, "handled_message" text null, "issued_by_id" varchar(255) not null, "original_form_id" int null, "form_submission" jsonb null);');
    this.addSql('create index "team_membership_request_team_id_index" on "team_membership_request" ("team_id");');
    this.addSql('create index "team_membership_request_user_id_index" on "team_membership_request" ("user_id");');
    this.addSql('create index "team_membership_request_state_index" on "team_membership_request" ("state");');

    this.addSql('create table "validation_step_users" ("validation_step_id" int not null, "user_id" varchar(255) not null, constraint "validation_step_users_pkey" primary key ("validation_step_id", "user_id"));');

    this.addSql('create table "tag" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "color" text check ("color" in (\'amber\', \'blue\', \'cyan\', \'emerald\', \'fuchsia\', \'gray\', \'green\', \'indigo\', \'lime\', \'neutral\', \'orange\', \'pink\', \'purple\', \'red\', \'rose\', \'sky\', \'slate\', \'stone\', \'teal\', \'violet\', \'yellow\', \'zinc\')) not null, "description" text null);');

    this.addSql('create table "doc_series_tags" ("doc_series_id" varchar(255) not null, "tag_id" int not null, constraint "doc_series_tags_pkey" primary key ("doc_series_id", "tag_id"));');

    this.addSql('create table "statistics" ("user_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "post_count" int not null, "last_post" timestamptz(0) null, "post_streak" int not null, "reply_count" int not null, "last_reply" timestamptz(0) null, "reply_streak" int not null, "comment_count" int not null, "last_comment" timestamptz(0) null, "comment_streak" int not null, "upload_count" int not null, "last_action" timestamptz(0) null, "action_streak" int not null, constraint "statistics_pkey" primary key ("user_id"));');

    this.addSql('create table "settings" ("user_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "gdpr_end_of_life_export" boolean not null, "gdpr_end_of_life_anonymize" boolean not null, "notification_mentionned" int not null, "notification_badge_unlocked" int not null, "notification_blog_subscribed_updated" int not null, "notification_content_removed" int not null, "notification_admin_report_created" int not null, "notification_team_event_created" int not null, "notification_team_subscribed_event_created" int not null, "notification_team_managed_form_updated" int not null, "notification_team_managed_event_updated" int not null, "notification_team_managed_membership_request_updated" int not null, "notification_team_managed_member_role_updated" int not null, "notification_admin_team_contact_updated" int not null, "notification_admin_team_legal_file_updated" int not null, "notification_team_event_subscribed_updated" int not null, "notification_team_event_managed_approved" int not null, "notification_team_event_managed_rejected" int not null, "notification_team_event_managed_registration_created" int not null, "notification_admin_team_event_validation_started" int not null, "notification_admin_team_event_validation_step" int not null, "notification_admin_team_event_validation_approved" int not null, "notification_admin_team_event_validation_rejected" int not null, "notification_thread_subscribed_updated" int not null, "notification_thread_subscribed_answered" int not null, "notification_admin_thread_stale" int not null, "notification_admin_thread_stale_threshold" int not null, "notification_admin_thread_assigned_stale" int not null, "notification_admin_thread_assigned_stale_threshold" int not null, "notification_admin_thread_assigned" int not null, "notification_role_updated" int not null, "notification_admin_role_updated" int not null, constraint "settings_pkey" primary key ("user_id"));');

    this.addSql('create table "school_group" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "english_name" text null, "parent_id" varchar(255) null, "description" text null, "active" boolean not null, constraint "school_group_pkey" primary key ("id"));');
    this.addSql('create index "school_group_parent_id_index" on "school_group" ("parent_id");');

    this.addSql('create table "subject" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "code" varchar(255) not null, "name" text not null, "english_name" text not null, "description" text null, "school_group_id" varchar(255) null, "active" boolean not null);');
    this.addSql('create index "subject_code_index" on "subject" ("code");');
    this.addSql('alter table "subject" add constraint "subject_code_unique" unique ("code");');

    this.addSql('create table "study_doc" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "subject_id" int not null, "doc_series_id" varchar(255) null, "year" int not null, "description" text null, "type" text check ("type" in (\'examDE\', \'examCE\', \'examCC\', \'examDM\', \'examTAI\', \'course\', \'sheet\', \'projects\', \'efreiClass\', \'eprofClass\', \'classNote\', \'other\')) not null, "flags" smallint not null, constraint "study_doc_pkey" primary key ("id"));');
    this.addSql('alter table "study_doc" add constraint "study_doc_file_id_unique" unique ("file_id");');

    this.addSql('create table "info_doc" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "doc_series_id" varchar(255) null, "year" int not null, "school_group_id" varchar(255) null, "description" text null, "is_obsolete" boolean not null, constraint "info_doc_pkey" primary key ("id"));');
    this.addSql('alter table "info_doc" add constraint "info_doc_file_id_unique" unique ("file_id");');

    this.addSql('create table "school_group_membership" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "active" boolean not null, "school_year_id" int not null, "school_group_id" varchar(255) not null, "user_id" varchar(255) not null, "role" text check ("role" in (\'representative\', \'substitute\', \'student\')) not null);');
    this.addSql('create index "school_group_membership_active_index" on "school_group_membership" ("active");');
    this.addSql('create index "school_group_membership_school_year_id_index" on "school_group_membership" ("school_year_id");');
    this.addSql('create index "school_group_membership_school_group_id_index" on "school_group_membership" ("school_group_id");');

    this.addSql('create table "content" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" text not null, "is_anonymous" boolean not null, "author_id" varchar(255) not null, "upvote_count" int not null, "downvote_count" int not null, "total_vote_count" int not null, "report_count" int not null, "favorite_count" int not null, "reply_count" int not null, "kind" smallint not null, "parent_id" int null, "content_master_id" int null, "hidden" boolean not null, "is_visible" boolean not null, "last_edit_id" int null);');
    this.addSql('create index "content_kind_index" on "content" ("kind");');
    this.addSql('alter table "content" add constraint "content_last_edit_id_unique" unique ("last_edit_id");');

    this.addSql('create table "content_edit" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" text not null, "edit_order" int not null, "parent_id" int not null, "edited_by_id" varchar(255) not null);');

    this.addSql('create table "attachment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "content_id" int null, constraint "attachment_pkey" primary key ("id"));');
    this.addSql('alter table "attachment" add constraint "attachment_file_id_unique" unique ("file_id");');

    this.addSql('create table "content_master" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null, "post_id" int not null, "kind" text check ("kind" in (\'blog\', \'thread\')) not null, "slug" text null, "category" text null, "location_name" text null, "location" text null, "is_draft" boolean null, "type" smallint null, "scope_id" varchar(255) null, "locked" boolean null, "op_validation_id" int null);');
    this.addSql('alter table "content_master" add constraint "content_master_post_id_unique" unique ("post_id");');
    this.addSql('create index "content_master_kind_index" on "content_master" ("kind");');
    this.addSql('alter table "content_master" add constraint "content_master_op_validation_id_unique" unique ("op_validation_id");');

    this.addSql('create table "validation" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content_master_id" int null, "user_id" varchar(255) not null, "content_id" int not null, "active" boolean not null, "type" varchar(255) not null);');
    this.addSql('create index "validation_user_id_index" on "validation" ("user_id");');
    this.addSql('create index "validation_content_id_index" on "validation" ("content_id");');

    this.addSql('create table "vote" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content_master_id" int null, "user_id" varchar(255) not null, "content_id" int not null, "value" smallint not null);');
    this.addSql('create index "vote_user_id_index" on "vote" ("user_id");');
    this.addSql('create index "vote_content_id_index" on "vote" ("content_id");');

    this.addSql('create table "content_master_tags" ("content_master_id" int not null, "tag_id" int not null, constraint "content_master_tags_pkey" primary key ("content_master_id", "tag_id"));');

    this.addSql('create table "content_master_participants" ("content_master_id" int not null, "user_id" varchar(255) not null, constraint "content_master_participants_pkey" primary key ("content_master_id", "user_id"));');

    this.addSql('create table "content_master_assigned_teams" ("content_master_id" int not null, "team_id" int not null, constraint "content_master_assigned_teams_pkey" primary key ("content_master_id", "team_id"));');

    this.addSql('create table "content_master_assigned_users" ("content_master_id" int not null, "user_id" varchar(255) not null, constraint "content_master_assigned_users_pkey" primary key ("content_master_id", "user_id"));');

    this.addSql('create table "report" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content_master_id" int null, "user_id" varchar(255) not null, "content_id" int not null, "target_id" varchar(255) not null, "reason" text null);');
    this.addSql('create index "report_user_id_index" on "report" ("user_id");');
    this.addSql('create index "report_content_id_index" on "report" ("content_id");');
    this.addSql('create index "report_target_id_index" on "report" ("target_id");');

    this.addSql('create table "reaction" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content_master_id" int null, "user_id" varchar(255) not null, "content_id" int not null, "value" text check ("value" in (\'what\', \'interesting\', \'like\', \'not-an-issue\', \'bump\', \'laugh\', \'unsure\', \'partial\', \'perfect\')) not null);');
    this.addSql('create index "reaction_user_id_index" on "reaction" ("user_id");');
    this.addSql('create index "reaction_content_id_index" on "reaction" ("content_id");');
    this.addSql('create index "reaction_value_index" on "reaction" ("value");');

    this.addSql('create table "metric" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "value" real not null, "name" text check ("name" in (\'clubCount\', \'clubMembershipCount\', \'clubUniqueMembershipCount\', \'clubEventCount\', \'clubCreatedEventCount\', \'userCount\')) not null);');

    this.addSql('create table "favorite" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content_master_id" int null, "user_id" varchar(255) not null, "content_id" int not null, "active" boolean not null);');
    this.addSql('create index "favorite_user_id_index" on "favorite" ("user_id");');
    this.addSql('create index "favorite_content_id_index" on "favorite" ("content_id");');

    this.addSql('create table "announcement" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "short_description" text not null, "long_description" text null, "state" text check ("state" in (\'draft\', \'committed\', \'hidden\')) not null, "display_from" timestamptz(0) not null, "display_until" timestamptz(0) not null, "priority" smallint not null, "created_by_id" varchar(255) not null);');

    this.addSql('alter table "daily_menu_starters" add constraint "daily_menu_starters_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_starters" add constraint "daily_menu_starters_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "daily_menu_dishes" add constraint "daily_menu_dishes_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_dishes" add constraint "daily_menu_dishes_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "daily_menu_desserts" add constraint "daily_menu_desserts_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_desserts" add constraint "daily_menu_desserts_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "validation_step" add constraint "validation_step_configuration_id_foreign" foreign key ("configuration_id") references "configuration" ("id") on update cascade;');

    this.addSql('alter table "badge_unlock" add constraint "badge_unlock_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "badge_unlock" add constraint "badge_unlock_badge_id_foreign" foreign key ("badge_id") references "badge" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "file_upload" add constraint "file_upload_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "team" add constraint "team_membership_request_form_id_foreign" foreign key ("membership_request_form_id") references "team_form" ("id") on update cascade on delete set null;');

    this.addSql('alter table "contact_account" add constraint "contact_account_contact_id_foreign" foreign key ("contact_id") references "contact" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "contact_account" add constraint "contact_account_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "contact_account" add constraint "contact_account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "profile_image" add constraint "profile_image_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "profile_image" add constraint "profile_image_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "profile_image" add constraint "profile_image_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_file" add constraint "team_file_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_file" add constraint "team_file_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "team_form" add constraint "team_form_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "team_form" add constraint "team_form_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_event" add constraint "team_event_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "team_event" add constraint "team_event_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_event" add constraint "team_event_supervisor_id_foreign" foreign key ("supervisor_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_event" add constraint "team_event_form_id_foreign" foreign key ("form_id") references "team_form" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_event" add constraint "team_event_used_template_id_foreign" foreign key ("used_template_id") references "team_event" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_original_form_id_foreign" foreign key ("original_form_id") references "team_form" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_event_validation" add constraint "team_event_validation_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade;');
    this.addSql('alter table "team_event_validation" add constraint "team_event_validation_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "team_event_validation" add constraint "team_event_validation_step_id_foreign" foreign key ("step_id") references "validation_step" ("id") on update cascade;');

    this.addSql('alter table "team_finance" add constraint "team_finance_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "team_finance" add constraint "team_finance_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_finance" add constraint "team_finance_due_to_id_foreign" foreign key ("due_to_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_receipt_id_foreign" foreign key ("receipt_id") references "team_file" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_member" add constraint "team_member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_member" add constraint "team_member_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_handled_by_id_foreign" foreign key ("handled_by_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_issued_by_id_foreign" foreign key ("issued_by_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_original_form_id_foreign" foreign key ("original_form_id") references "team_form" ("id") on update cascade on delete set null;');

    this.addSql('alter table "validation_step_users" add constraint "validation_step_users_validation_step_id_foreign" foreign key ("validation_step_id") references "validation_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "validation_step_users" add constraint "validation_step_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "doc_series_tags" add constraint "doc_series_tags_doc_series_id_foreign" foreign key ("doc_series_id") references "doc_series" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "doc_series_tags" add constraint "doc_series_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "statistics" add constraint "statistics_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "settings" add constraint "settings_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "school_group" add constraint "school_group_parent_id_foreign" foreign key ("parent_id") references "school_group" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "subject" add constraint "subject_school_group_id_foreign" foreign key ("school_group_id") references "school_group" ("id") on update cascade on delete set null;');

    this.addSql('alter table "study_doc" add constraint "study_doc_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "study_doc" add constraint "study_doc_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade;');
    this.addSql('alter table "study_doc" add constraint "study_doc_doc_series_id_foreign" foreign key ("doc_series_id") references "doc_series" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "info_doc" add constraint "info_doc_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "info_doc" add constraint "info_doc_doc_series_id_foreign" foreign key ("doc_series_id") references "doc_series" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "info_doc" add constraint "info_doc_school_group_id_foreign" foreign key ("school_group_id") references "school_group" ("id") on update cascade on delete set null;');

    this.addSql('alter table "school_group_membership" add constraint "school_group_membership_school_year_id_foreign" foreign key ("school_year_id") references "school_year" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "school_group_membership" add constraint "school_group_membership_school_group_id_foreign" foreign key ("school_group_id") references "school_group" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "school_group_membership" add constraint "school_group_membership_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "content" add constraint "content_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content" add constraint "content_parent_id_foreign" foreign key ("parent_id") references "content" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content" add constraint "content_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content" add constraint "content_last_edit_id_foreign" foreign key ("last_edit_id") references "content_edit" ("id") on update cascade on delete set null;');

    this.addSql('alter table "content_edit" add constraint "content_edit_parent_id_foreign" foreign key ("parent_id") references "content" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content_edit" add constraint "content_edit_edited_by_id_foreign" foreign key ("edited_by_id") references "user" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "attachment" add constraint "attachment_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "attachment" add constraint "attachment_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "content_master" add constraint "content_master_post_id_foreign" foreign key ("post_id") references "content" ("id") on update cascade;');
    this.addSql('alter table "content_master" add constraint "content_master_scope_id_foreign" foreign key ("scope_id") references "school_group" ("id") on update cascade on delete set null;');
    this.addSql('alter table "content_master" add constraint "content_master_op_validation_id_foreign" foreign key ("op_validation_id") references "validation" ("id") on update cascade on delete set null;');

    this.addSql('alter table "validation" add constraint "validation_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "validation" add constraint "validation_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "validation" add constraint "validation_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "vote" add constraint "vote_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "vote" add constraint "vote_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "vote" add constraint "vote_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "content_master_tags" add constraint "content_master_tags_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_tags" add constraint "content_master_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content_master_participants" add constraint "content_master_participants_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_participants" add constraint "content_master_participants_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content_master_assigned_teams" add constraint "content_master_assigned_teams_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_assigned_teams" add constraint "content_master_assigned_teams_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content_master_assigned_users" add constraint "content_master_assigned_users_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_assigned_users" add constraint "content_master_assigned_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "report" add constraint "report_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "report" add constraint "report_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "report" add constraint "report_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "report" add constraint "report_target_id_foreign" foreign key ("target_id") references "user" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "reaction" add constraint "reaction_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "reaction" add constraint "reaction_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "reaction" add constraint "reaction_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "favorite" add constraint "favorite_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "favorite" add constraint "favorite_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "favorite" add constraint "favorite_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "announcement" add constraint "announcement_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
  }

}
