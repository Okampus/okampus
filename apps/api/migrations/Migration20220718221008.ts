import { Migration } from '@mikro-orm/migrations';

export class Migration20220718221008 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "food" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "nutritionals" text null, "allergens" text null, "type" int2 not null);');

    this.addSql('create table "daily_menu" ("id" timestamptz(0) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "daily_menu" add constraint "daily_menu_pkey" primary key ("id");');

    this.addSql('create table "daily_menu_starters" ("daily_menu_id" timestamptz(0) not null, "food_id" int4 not null);');
    this.addSql('alter table "daily_menu_starters" add constraint "daily_menu_starters_pkey" primary key ("daily_menu_id", "food_id");');

    this.addSql('create table "daily_menu_dishes" ("daily_menu_id" timestamptz(0) not null, "food_id" int4 not null);');
    this.addSql('alter table "daily_menu_dishes" add constraint "daily_menu_dishes_pkey" primary key ("daily_menu_id", "food_id");');

    this.addSql('create table "daily_menu_desserts" ("daily_menu_id" timestamptz(0) not null, "food_id" int4 not null);');
    this.addSql('alter table "daily_menu_desserts" add constraint "daily_menu_desserts_pkey" primary key ("daily_menu_id", "food_id");');

    this.addSql('create table "daily_info" ("id" timestamptz(0) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content" text not null);');
    this.addSql('alter table "daily_info" add constraint "daily_info_pkey" primary key ("id");');

    this.addSql('create table "doc_series" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "english_name" text null, "description" text null, "is_obsolete" bool null);');
    this.addSql('alter table "doc_series" add constraint "doc_series_pkey" primary key ("id");');

    this.addSql('create table "badge" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "description" text not null, "point_prize" int4 not null, "level" int2 not null, "icon" text not null, "series" text not null, "statistic" text check ("statistic" in (\'comment\', \'post\', \'reply\', \'upload\')) not null, "statistic_threshold" int4 not null);');

    this.addSql('create table "contact" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "icon" text not null);');

    this.addSql('create table "wiki_page" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null, "body" text not null, "category" text not null, "hidden" bool not null);');

    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "firstname" text not null, "lastname" text not null, "password" text null, "email" text not null, "reputation" int4 not null, "avatar" text null, "roles" text[] not null default \'{user}\', "school_role" text check ("school_role" in (\'student\', \'teacher\', \'admin\')) not null, "color" text null, "signature" text null, "banner" text null, "short_description" text null, "points" int4 not null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');
    this.addSql('create index "user_email_index" on "user" ("email");');

    this.addSql('create table "badge_unlock" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "badge_id" int4 not null, "unlock_date" timestamptz(0) not null);');
    this.addSql('create index "badge_unlock_user_id_index" on "badge_unlock" ("user_id");');

    this.addSql('create table "file_upload" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "name" text not null, "file_size" int4 not null, "mime_type" text not null, "file_last_modified_at" timestamptz(0) not null, "validated" bool not null, "url" text not null, "visible" bool not null, "file_kind" text check ("file_kind" in (\'profile-image\', \'info-doc\', \'attachment\', \'study-doc\', \'team-file\')) not null);');
    this.addSql('alter table "file_upload" add constraint "file_upload_pkey" primary key ("id");');

    this.addSql('create table "info_doc" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "doc_series_id" varchar(255) null, "year" int4 not null, "school_year" int2 null, "description" text null, "is_obsolete" bool not null);');
    this.addSql('alter table "info_doc" add constraint "info_doc_pkey" primary key ("id");');
    this.addSql('alter table "info_doc" add constraint "info_doc_file_id_unique" unique ("file_id");');

    this.addSql('create table "team" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "kind" text check ("kind" in (\'team\', \'club\')) not null, "name" text not null, "short_description" text null, "long_description" text null, "category" text not null, "tags" text[] not null, "avatar" text null, "banner" text null, "membership_request_link" text null, "membership_request_message" text null, "membership_request_form_id" int4 null);');
    this.addSql('create index "team_kind_index" on "team" ("kind");');
    this.addSql('alter table "team" add constraint "team_membership_request_form_id_unique" unique ("membership_request_form_id");');

    this.addSql('create table "contact_account" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "kind" text check ("kind" in (\'team\', \'user\')) not null, "contact_id" int4 not null, "link" text null, "pseudo" text not null, "team_id" int4 null, "user_id" varchar(255) null);');
    this.addSql('create index "contact_account_kind_index" on "contact_account" ("kind");');
    this.addSql('create index "contact_account_team_id_index" on "contact_account" ("team_id");');
    this.addSql('create index "contact_account_user_id_index" on "contact_account" ("user_id");');

    this.addSql('create table "profile_image" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "user_id" varchar(255) null, "team_id" int4 null);');
    this.addSql('alter table "profile_image" add constraint "profile_image_pkey" primary key ("id");');
    this.addSql('alter table "profile_image" add constraint "profile_image_file_id_unique" unique ("file_id");');

    this.addSql('create table "team_file" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "team_id" int4 not null, "type" text check ("type" in (\'gallery\', \'document\')) not null, "description" text null);');
    this.addSql('alter table "team_file" add constraint "team_file_pkey" primary key ("id");');
    this.addSql('alter table "team_file" add constraint "team_file_file_id_unique" unique ("file_id");');

    this.addSql('create table "team_form" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" text null, "form" jsonb not null, "created_by_id" varchar(255) not null, "team_id" int4 not null, "is_template" bool not null);');
    this.addSql('create index "team_form_team_id_index" on "team_form" ("team_id");');

    this.addSql('create table "team_event" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "name" varchar(255) not null, "description" text not null, "price" int4 not null, "created_by_id" varchar(255) not null, "team_id" int4 not null, "place" text not null, "supervisor_id" varchar(255) null, "private" bool not null, "state" text check ("state" in (\'template\', \'draft\', \'published\', \'approved\', \'rejected\')) not null default \'published\', "form_id" int4 null, "used_template_id" int4 null, "meta" jsonb not null);');
    this.addSql('create index "team_event_team_id_index" on "team_event" ("team_id");');
    this.addSql('create index "team_event_private_index" on "team_event" ("private");');
    this.addSql('alter table "team_event" add constraint "team_event_form_id_unique" unique ("form_id");');

    this.addSql('create table "team_event_registration" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "event_id" int4 not null, "user_id" varchar(255) not null, "status" text check ("status" in (\'sure\', \'maybe\', \'notsure\')) not null, "original_form_id" int4 null, "form_submission" jsonb null);');

    this.addSql('create table "team_member" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "team_id" int4 not null, "role" text check ("role" in (\'owner\', \'coowner\', \'treasurer\', \'secretary\', \'manager\', \'member\')) not null, "role_label" varchar(255) null, "join_date" timestamptz(0) not null);');
    this.addSql('create index "team_member_user_id_index" on "team_member" ("user_id");');
    this.addSql('create index "team_member_team_id_index" on "team_member" ("team_id");');

    this.addSql('create table "team_membership_request" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "team_id" int4 not null, "user_id" varchar(255) not null, "meta" jsonb null, "issuer" text check ("issuer" in (\'team\', \'user\')) not null, "state" text check ("state" in (\'pending\', \'approved\', \'rejected\')) not null, "role" text check ("role" in (\'owner\', \'coowner\', \'treasurer\', \'secretary\', \'manager\', \'member\')) not null, "handled_by_id" varchar(255) null, "handled_at" timestamptz(0) null, "handled_message" text null, "issued_by_id" varchar(255) not null, "original_form_id" int4 null, "form_submission" jsonb null);');
    this.addSql('create index "team_membership_request_team_id_index" on "team_membership_request" ("team_id");');
    this.addSql('create index "team_membership_request_user_id_index" on "team_membership_request" ("user_id");');
    this.addSql('create index "team_membership_request_state_index" on "team_membership_request" ("state");');

    this.addSql('create table "validation" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content_master_id" int4 null, "user_id" varchar(255) not null, "content_id" int4 not null, "active" bool not null default true, "type" text check ("type" in (\'op\', \'admin\')) not null);');
    this.addSql('create index "validation_user_id_index" on "validation" ("user_id");');
    this.addSql('create index "validation_content_id_index" on "validation" ("content_id");');

    this.addSql('create table "content" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" text not null, "author_id" varchar(255) not null, "upvote_count" int4 not null, "downvote_count" int4 not null, "total_vote_count" int4 not null, "report_count" int4 not null, "favorite_count" int4 not null, "reply_count" int4 not null, "kind" int2 not null, "parent_id" int4 null, "content_master_id" int4 null, "hidden" bool not null, "is_visible" bool not null, "last_edit_id" int4 null);');
    this.addSql('create index "content_kind_index" on "content" ("kind");');
    this.addSql('alter table "content" add constraint "content_last_edit_id_unique" unique ("last_edit_id");');

    this.addSql('create table "content_edit" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" text not null, "edit_order" int4 not null, "parent_id" int4 not null, "edited_by_id" varchar(255) not null);');

    this.addSql('create table "attachment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "content_id" int4 null);');
    this.addSql('alter table "attachment" add constraint "attachment_pkey" primary key ("id");');
    this.addSql('alter table "attachment" add constraint "attachment_file_id_unique" unique ("file_id");');

    this.addSql('create table "content_master" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null, "post_id" int4 not null, "kind" text check ("kind" in (\'blog\', \'thread\')) not null, "slug" text null, "category" text null, "location_name" text null, "location" text null, "is_draft" bool null, "type" int2 null, "locked" bool null, "op_validation_id" int4 null);');
    this.addSql('alter table "content_master" add constraint "content_master_post_id_unique" unique ("post_id");');
    this.addSql('create index "content_master_kind_index" on "content_master" ("kind");');
    this.addSql('alter table "content_master" add constraint "content_master_op_validation_id_unique" unique ("op_validation_id");');

    this.addSql('create table "vote" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content_master_id" int4 null, "user_id" varchar(255) not null, "content_id" int4 not null, "value" int2 not null);');
    this.addSql('create index "vote_user_id_index" on "vote" ("user_id");');
    this.addSql('create index "vote_content_id_index" on "vote" ("content_id");');

    this.addSql('create table "content_master_participants" ("content_master_id" int4 not null, "user_id" varchar(255) not null);');
    this.addSql('alter table "content_master_participants" add constraint "content_master_participants_pkey" primary key ("content_master_id", "user_id");');

    this.addSql('create table "content_master_assignees" ("content_master_id" int4 not null, "user_id" varchar(255) not null);');
    this.addSql('alter table "content_master_assignees" add constraint "content_master_assignees_pkey" primary key ("content_master_id", "user_id");');

    this.addSql('create table "tag" ("name" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "color" text check ("color" in (\'amber\', \'blue\', \'cyan\', \'emerald\', \'fuchsia\', \'gray\', \'green\', \'indigo\', \'lime\', \'neutral\', \'orange\', \'pink\', \'purple\', \'red\', \'rose\', \'sky\', \'slate\', \'stone\', \'teal\', \'violet\', \'yellow\', \'zinc\')) not null, "description" text null);');
    this.addSql('alter table "tag" add constraint "tag_pkey" primary key ("name");');

    this.addSql('create table "content_master_tags" ("content_master_id" int4 not null, "tag_id" text not null);');
    this.addSql('alter table "content_master_tags" add constraint "content_master_tags_pkey" primary key ("content_master_id", "tag_id");');

    this.addSql('create table "doc_series_tags" ("doc_series_id" varchar(255) not null, "tag_id" text not null);');
    this.addSql('alter table "doc_series_tags" add constraint "doc_series_tags_pkey" primary key ("doc_series_id", "tag_id");');

    this.addSql('create table "subject" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "english_name" text not null, "description" text null, "school_year" int2 not null);');
    this.addSql('alter table "subject" add constraint "subject_pkey" primary key ("id");');

    this.addSql('create table "study_doc" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "subject_id" varchar(255) not null, "doc_series_id" varchar(255) null, "year" int4 not null, "description" text null, "cursus" text check ("cursus" in (\'all\', \'classic\', \'int\', \'pex\', \'renforced\')) not null, "type" text check ("type" in (\'examDE\', \'examCE\', \'examCC\', \'examDM\', \'examTAI\', \'course\', \'sheet\', \'projects\', \'efreiClass\', \'eprofClass\', \'classNote\', \'other\')) not null, "flags" int2 not null);');
    this.addSql('alter table "study_doc" add constraint "study_doc_pkey" primary key ("id");');
    this.addSql('alter table "study_doc" add constraint "study_doc_file_id_unique" unique ("file_id");');

    this.addSql('create table "statistics" ("user_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "post_count" int4 not null, "last_post" timestamptz(0) null, "post_streak" int4 not null, "reply_count" int4 not null, "last_reply" timestamptz(0) null, "reply_streak" int4 not null, "comment_count" int4 not null, "last_comment" timestamptz(0) null, "comment_streak" int4 not null, "upload_count" int4 not null, "last_action" timestamptz(0) null, "action_streak" int4 not null);');
    this.addSql('alter table "statistics" add constraint "statistics_pkey" primary key ("user_id");');

    this.addSql('create table "report" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content_master_id" int4 null, "user_id" varchar(255) not null, "content_id" int4 not null, "target_id" varchar(255) not null, "reason" text null);');
    this.addSql('create index "report_user_id_index" on "report" ("user_id");');
    this.addSql('create index "report_content_id_index" on "report" ("content_id");');
    this.addSql('create index "report_target_id_index" on "report" ("target_id");');

    this.addSql('create table "reaction" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content_master_id" int4 null, "user_id" varchar(255) not null, "content_id" int4 not null, "value" text check ("value" in (\'what\', \'interesting\', \'like\', \'notanissue\', \'bump\', \'laugh\', \'unsure\', \'partial\', \'perfect\')) not null);');
    this.addSql('create index "reaction_user_id_index" on "reaction" ("user_id");');
    this.addSql('create index "reaction_content_id_index" on "reaction" ("content_id");');
    this.addSql('create index "reaction_value_index" on "reaction" ("value");');

    this.addSql('create table "metric" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "value" real not null, "name" text check ("name" in (\'clubCount\', \'clubMembershipCount\', \'clubUniqueMembershipCount\', \'clubEventCount\', \'clubCreatedEventCount\', \'userCount\')) not null);');

    this.addSql('create table "favorite" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content_master_id" int4 null, "user_id" varchar(255) not null, "content_id" int4 not null, "active" bool not null default true);');
    this.addSql('create index "favorite_user_id_index" on "favorite" ("user_id");');
    this.addSql('create index "favorite_content_id_index" on "favorite" ("content_id");');

    this.addSql('create table "announcement" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "short_description" text not null, "long_description" text null, "state" text check ("state" in (\'draft\', \'committed\', \'hidden\')) not null, "display_from" timestamptz(0) not null, "display_until" timestamptz(0) not null, "priority" int2 not null, "created_by_id" varchar(255) not null);');

    this.addSql('alter table "daily_menu_starters" add constraint "daily_menu_starters_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_starters" add constraint "daily_menu_starters_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "daily_menu_dishes" add constraint "daily_menu_dishes_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_dishes" add constraint "daily_menu_dishes_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "daily_menu_desserts" add constraint "daily_menu_desserts_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_desserts" add constraint "daily_menu_desserts_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "badge_unlock" add constraint "badge_unlock_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "badge_unlock" add constraint "badge_unlock_badge_id_foreign" foreign key ("badge_id") references "badge" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "file_upload" add constraint "file_upload_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "info_doc" add constraint "info_doc_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "info_doc" add constraint "info_doc_doc_series_id_foreign" foreign key ("doc_series_id") references "doc_series" ("id") on update cascade on delete CASCADE;');

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

    this.addSql('alter table "team_member" add constraint "team_member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_member" add constraint "team_member_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_handled_by_id_foreign" foreign key ("handled_by_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_issued_by_id_foreign" foreign key ("issued_by_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_original_form_id_foreign" foreign key ("original_form_id") references "team_form" ("id") on update cascade on delete set null;');

    this.addSql('alter table "validation" add constraint "validation_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "validation" add constraint "validation_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "validation" add constraint "validation_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "content" add constraint "content_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content" add constraint "content_parent_id_foreign" foreign key ("parent_id") references "content" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content" add constraint "content_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content" add constraint "content_last_edit_id_foreign" foreign key ("last_edit_id") references "content_edit" ("id") on update cascade on delete set null;');

    this.addSql('alter table "content_edit" add constraint "content_edit_parent_id_foreign" foreign key ("parent_id") references "content" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content_edit" add constraint "content_edit_edited_by_id_foreign" foreign key ("edited_by_id") references "user" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "attachment" add constraint "attachment_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "attachment" add constraint "attachment_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete set null;');

    this.addSql('alter table "content_master" add constraint "content_master_post_id_foreign" foreign key ("post_id") references "content" ("id") on update cascade;');
    this.addSql('alter table "content_master" add constraint "content_master_op_validation_id_foreign" foreign key ("op_validation_id") references "validation" ("id") on update cascade on delete set null;');

    this.addSql('alter table "vote" add constraint "vote_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "vote" add constraint "vote_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "vote" add constraint "vote_content_id_foreign" foreign key ("content_id") references "content" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "content_master_participants" add constraint "content_master_participants_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_participants" add constraint "content_master_participants_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content_master_assignees" add constraint "content_master_assignees_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_assignees" add constraint "content_master_assignees_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content_master_tags" add constraint "content_master_tags_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_tags" add constraint "content_master_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("name") on update cascade on delete cascade;');

    this.addSql('alter table "doc_series_tags" add constraint "doc_series_tags_doc_series_id_foreign" foreign key ("doc_series_id") references "doc_series" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "doc_series_tags" add constraint "doc_series_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("name") on update cascade on delete cascade;');

    this.addSql('alter table "study_doc" add constraint "study_doc_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "study_doc" add constraint "study_doc_subject_id_foreign" foreign key ("subject_id") references "subject" ("id") on update cascade;');
    this.addSql('alter table "study_doc" add constraint "study_doc_doc_series_id_foreign" foreign key ("doc_series_id") references "doc_series" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "statistics" add constraint "statistics_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

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
