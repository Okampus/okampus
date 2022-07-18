import { Migration } from '@mikro-orm/migrations';

export class Migration20220720152209 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "settings" ("user_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "gdpr_end_of_life_export" bool not null, "gdpr_end_of_life_anonymize" bool not null, "notification_mentionned" int4 not null, "notification_badge_unlocked" int4 not null, "notification_blog_subscribed_updated" int4 not null, "notification_content_removed" int4 not null, "notification_admin_report_created" int4 not null, "notification_team_event_created" int4 not null, "notification_team_subscribed_event_created" int4 not null, "notification_team_managed_form_updated" int4 not null, "notification_team_managed_event_updated" int4 not null, "notification_team_managed_membership_request_updated" int4 not null, "notification_team_managed_member_role_updated" int4 not null, "notification_admin_team_contact_updated" int4 not null, "notification_admin_team_legal_file_updated" int4 not null, "notification_team_event_subscribed_updated" int4 not null, "notification_team_event_managed_approved" int4 not null, "notification_team_event_managed_rejected" int4 not null, "notification_team_event_managed_registration_created" int4 not null, "notification_admin_team_event_validation_started" int4 not null, "notification_admin_team_event_validation_step" int4 not null, "notification_admin_team_event_validation_approved" int4 not null, "notification_admin_team_event_validation_rejected" int4 not null, "notification_thread_subscribed_updated" int4 not null, "notification_thread_subscribed_answered" int4 not null, "notification_admin_thread_stale" int4 not null, "notification_admin_thread_stale_threshold" int4 not null, "notification_admin_thread_assigned_stale" int4 not null, "notification_admin_thread_assigned_stale_threshold" int4 not null, "notification_admin_thread_assigned" int4 not null, "notification_role_updated" int4 not null, "notification_admin_role_updated" int4 not null);');
    this.addSql('alter table "settings" add constraint "settings_pkey" primary key ("user_id");');
    this.addSql('alter table "settings" add constraint "settings_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete cascade;');
  }

}