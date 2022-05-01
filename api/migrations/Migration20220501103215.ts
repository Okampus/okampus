import { Migration } from '@mikro-orm/migrations';

export class Migration20220501103215 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team" ("team_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "kind" text check ("kind" in (\'team\', \'club\')) not null, "name" text not null, "description" text null, "avatar" text null);');

    this.addSql('create table "daily_info" ("date" timestamptz(0) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content" text not null);');
    this.addSql('alter table "daily_info" add constraint "daily_info_pkey" primary key ("date");');

    this.addSql('create table "food" ("food_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "nutritionals" text null, "allergens" text null, "type" int2 not null);');

    this.addSql('create table "daily_menu" ("date" timestamptz(0) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "daily_menu" add constraint "daily_menu_pkey" primary key ("date");');

    this.addSql('create table "daily_menu_starters" ("daily_menu_id" timestamptz(0) not null, "food_id" int4 not null);');
    this.addSql('alter table "daily_menu_starters" add constraint "daily_menu_starters_pkey" primary key ("daily_menu_id", "food_id");');

    this.addSql('create table "daily_menu_dishes" ("daily_menu_id" timestamptz(0) not null, "food_id" int4 not null);');
    this.addSql('alter table "daily_menu_dishes" add constraint "daily_menu_dishes_pkey" primary key ("daily_menu_id", "food_id");');

    this.addSql('create table "daily_menu_desserts" ("daily_menu_id" timestamptz(0) not null, "food_id" int4 not null);');
    this.addSql('alter table "daily_menu_desserts" add constraint "daily_menu_desserts_pkey" primary key ("daily_menu_id", "food_id");');

    this.addSql('create table "doc_series" ("doc_series_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "english_name" text null, "description" text null, "is_obsolete" bool null);');
    this.addSql('alter table "doc_series" add constraint "doc_series_pkey" primary key ("doc_series_id");');

    this.addSql('create table "contact" ("contact_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "icon" text not null);');

    this.addSql('create table "badge" ("badge_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "description" text not null, "point_prize" int4 not null, "level" int2 not null, "icon" text not null, "serie" text not null, "statistic" text check ("statistic" in (\'comment\', \'post\', \'reply\', \'upload\')) not null, "statistic_threshold" int4 not null);');

    this.addSql('create table "wiki_page" ("wiki_page_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null, "body" text not null, "category" text not null, "hidden" bool not null);');

    this.addSql('create table "user" ("user_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "firstname" text not null, "lastname" text not null, "password" text null, "email" text not null, "reputation" int4 not null, "avatar" text null, "roles" text[] not null default \'{user}\', "school_role" text check ("school_role" in (\'student\', \'teacher\', \'admin\')) not null, "color" text null, "signature" text null, "banner" text null, "description" text null, "points" int4 not null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("user_id");');
    this.addSql('create index "user_email_index" on "user" ("email");');

    this.addSql('create table "badge_unlock" ("badge_unlock_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "badge_id" int4 not null, "unlock_date" timestamptz(0) not null);');
    this.addSql('create index "badge_unlock_user_id_index" on "badge_unlock" ("user_id");');

    this.addSql('create table "contact_account" ("contact_account_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "kind" text check ("kind" in (\'team\', \'user\')) not null, "contact_id" int4 not null, "link" text null, "pseudo" text not null, "team_id" int4 null, "user_id" varchar(255) null);');
    this.addSql('create index "contact_account_kind_index" on "contact_account" ("kind");');
    this.addSql('create index "contact_account_team_id_index" on "contact_account" ("team_id");');
    this.addSql('create index "contact_account_user_id_index" on "contact_account" ("user_id");');

    this.addSql('create table "file_upload" ("file_upload_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "name" text not null, "file_size" int4 not null, "mime_type" text not null, "file_last_modified_at" timestamptz(0) not null, "validated" bool not null, "url" text not null, "visible" bool not null, "file_kind" text check ("file_kind" in (\'profile-image\', \'info-doc\', \'attachment\', \'study-doc\')) not null);');
    this.addSql('alter table "file_upload" add constraint "file_upload_pkey" primary key ("file_upload_id");');

    this.addSql('create table "info_doc" ("info_doc_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "doc_series_id" varchar(255) null, "year" int4 not null, "school_year" int2 null, "description" text null, "is_obsolete" bool not null);');
    this.addSql('alter table "info_doc" add constraint "info_doc_pkey" primary key ("info_doc_id");');
    this.addSql('alter table "info_doc" add constraint "info_doc_file_id_unique" unique ("file_id");');

    this.addSql('create table "profile_image" ("profile_image_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "user_id" varchar(255) null, "team_id" int4 null);');
    this.addSql('alter table "profile_image" add constraint "profile_image_pkey" primary key ("profile_image_id");');
    this.addSql('alter table "profile_image" add constraint "profile_image_file_id_unique" unique ("file_id");');

    this.addSql('create table "team_member" ("team_member_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "team_id" int4 not null, "role" text check ("role" in (\'owner\', \'leader\', \'manager\', \'member\')) not null, "role_label" varchar(255) null, "join_date" timestamptz(0) not null);');
    this.addSql('create index "team_member_user_id_index" on "team_member" ("user_id");');
    this.addSql('create index "team_member_team_id_index" on "team_member" ("team_id");');

    this.addSql('create table "content_master" ("content_master_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "post_id" int4 null, "kind" text check ("kind" in (\'blog\', \'thread\')) not null, "slug" text null, "category" text null, "location_name" text null, "location" text null, "is_draft" bool null, "title" text null, "type" int2 null, "locked" bool null, "op_validated_with_id" int4 null, "admin_validated_with_id" int4 null, "admin_validated_by_id" varchar(255) null);');
    this.addSql('alter table "content_master" add constraint "content_master_post_id_unique" unique ("post_id");');
    this.addSql('create index "content_master_kind_index" on "content_master" ("kind");');
    this.addSql('alter table "content_master" add constraint "content_master_op_validated_with_id_unique" unique ("op_validated_with_id");');
    this.addSql('alter table "content_master" add constraint "content_master_admin_validated_with_id_unique" unique ("admin_validated_with_id");');

    this.addSql('create table "content" ("content_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" text not null, "author_id" varchar(255) not null, "upvotes" int4 not null, "downvotes" int4 not null, "votes" int4 not null, "kind" int2 not null, "parent_id" int4 null, "content_master_type" text check ("content_master_type" in (\'blog\', \'thread\')) not null, "content_master_id" int4 not null, "hidden" bool not null, "is_visible" bool not null, "report_count" int4 not null, "last_edit_id" int4 null);');
    this.addSql('create index "content_kind_index" on "content" ("kind");');
    this.addSql('alter table "content" add constraint "content_last_edit_id_unique" unique ("last_edit_id");');

    this.addSql('create table "vote" ("vote_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "value" int2 not null, "user_id" varchar(255) not null, "content_id" int4 not null);');
    this.addSql('create index "vote_user_id_index" on "vote" ("user_id");');
    this.addSql('create index "vote_content_id_index" on "vote" ("content_id");');

    this.addSql('create table "attachment" ("attachment_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "content_id" int4 null);');
    this.addSql('alter table "attachment" add constraint "attachment_pkey" primary key ("attachment_id");');
    this.addSql('alter table "attachment" add constraint "attachment_file_id_unique" unique ("file_id");');

    this.addSql('create table "content_edit" ("content_edit_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" text not null, "edit_order" int4 not null, "parent_id" int4 not null, "edited_by_id" varchar(255) not null);');

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

    this.addSql('create table "subject" ("subject_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "english_name" text not null, "description" text null, "school_year" int2 not null);');
    this.addSql('alter table "subject" add constraint "subject_pkey" primary key ("subject_id");');

    this.addSql('create table "study_doc" ("study_doc_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "subject_id" varchar(255) not null, "doc_series_id" varchar(255) null, "year" int4 not null, "description" text null, "cursus" text check ("cursus" in (\'all\', \'classic\', \'int\', \'pex\', \'renforced\')) not null, "type" text check ("type" in (\'examDE\', \'examCE\', \'examCC\', \'examDM\', \'examTAI\', \'course\', \'sheet\', \'projects\', \'efreiClass\', \'eprofClass\', \'classNote\', \'other\')) not null, "flags" int2 not null);');
    this.addSql('alter table "study_doc" add constraint "study_doc_pkey" primary key ("study_doc_id");');
    this.addSql('alter table "study_doc" add constraint "study_doc_file_id_unique" unique ("file_id");');

    this.addSql('create table "statistics" ("user_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "post_count" int4 not null, "last_post" timestamptz(0) null, "post_streak" int4 not null, "reply_count" int4 not null, "last_reply" timestamptz(0) null, "reply_streak" int4 not null, "comment_count" int4 not null, "last_comment" timestamptz(0) null, "comment_streak" int4 not null, "upload_count" int4 not null, "last_action" timestamptz(0) null, "action_streak" int4 not null);');
    this.addSql('alter table "statistics" add constraint "statistics_pkey" primary key ("user_id");');

    this.addSql('create table "report" ("report_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "reporter_id" varchar(255) not null, "user_id" varchar(255) not null, "content_id" int4 null, "reason" text null);');
    this.addSql('create index "report_reporter_id_index" on "report" ("reporter_id");');
    this.addSql('create index "report_user_id_index" on "report" ("user_id");');
    this.addSql('create index "report_content_id_index" on "report" ("content_id");');
    this.addSql('alter table "report" add constraint "report_content_id_unique" unique ("content_id");');

    this.addSql('create table "reaction" ("reaction_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "content_id" int4 not null, "value" text check ("value" in (\'what\', \'interesting\', \'like\', \'laugh\', \'notanissue\', \'bump\', \'unsure\', \'partial\', \'perfect\')) not null);');
    this.addSql('create index "reaction_user_id_index" on "reaction" ("user_id");');
    this.addSql('create index "reaction_content_id_index" on "reaction" ("content_id");');
    this.addSql('create index "reaction_value_index" on "reaction" ("value");');

    this.addSql('create table "favorite" ("favorite_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "content_id" int4 not null);');
    this.addSql('create index "favorite_user_id_index" on "favorite" ("user_id");');
    this.addSql('create index "favorite_content_id_index" on "favorite" ("content_id");');
    this.addSql('alter table "favorite" add constraint "favorite_content_id_unique" unique ("content_id");');

    this.addSql('alter table "daily_menu_starters" add constraint "daily_menu_starters_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("date") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_starters" add constraint "daily_menu_starters_food_id_foreign" foreign key ("food_id") references "food" ("food_id") on update cascade on delete cascade;');

    this.addSql('alter table "daily_menu_dishes" add constraint "daily_menu_dishes_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("date") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_dishes" add constraint "daily_menu_dishes_food_id_foreign" foreign key ("food_id") references "food" ("food_id") on update cascade on delete cascade;');

    this.addSql('alter table "daily_menu_desserts" add constraint "daily_menu_desserts_daily_menu_id_foreign" foreign key ("daily_menu_id") references "daily_menu" ("date") on update cascade on delete cascade;');
    this.addSql('alter table "daily_menu_desserts" add constraint "daily_menu_desserts_food_id_foreign" foreign key ("food_id") references "food" ("food_id") on update cascade on delete cascade;');

    this.addSql('alter table "badge_unlock" add constraint "badge_unlock_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "badge_unlock" add constraint "badge_unlock_badge_id_foreign" foreign key ("badge_id") references "badge" ("badge_id") on update cascade on delete CASCADE;');

    this.addSql('alter table "contact_account" add constraint "contact_account_contact_id_foreign" foreign key ("contact_id") references "contact" ("contact_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "contact_account" add constraint "contact_account_team_id_foreign" foreign key ("team_id") references "team" ("team_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "contact_account" add constraint "contact_account_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete CASCADE;');

    this.addSql('alter table "file_upload" add constraint "file_upload_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade;');

    this.addSql('alter table "info_doc" add constraint "info_doc_file_id_foreign" foreign key ("file_id") references "file_upload" ("file_upload_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "info_doc" add constraint "info_doc_doc_series_id_foreign" foreign key ("doc_series_id") references "doc_series" ("doc_series_id") on update cascade on delete CASCADE;');

    this.addSql('alter table "profile_image" add constraint "profile_image_file_id_foreign" foreign key ("file_id") references "file_upload" ("file_upload_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "profile_image" add constraint "profile_image_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "profile_image" add constraint "profile_image_team_id_foreign" foreign key ("team_id") references "team" ("team_id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_member" add constraint "team_member_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_member" add constraint "team_member_team_id_foreign" foreign key ("team_id") references "team" ("team_id") on update cascade on delete CASCADE;');

    this.addSql('alter table "content_master" add constraint "content_master_post_id_foreign" foreign key ("post_id") references "content" ("content_id") on update cascade on delete set null;');
    this.addSql('alter table "content_master" add constraint "content_master_op_validated_with_id_foreign" foreign key ("op_validated_with_id") references "content" ("content_id") on update cascade on delete set null;');
    this.addSql('alter table "content_master" add constraint "content_master_admin_validated_with_id_foreign" foreign key ("admin_validated_with_id") references "content" ("content_id") on update cascade on delete set null;');
    this.addSql('alter table "content_master" add constraint "content_master_admin_validated_by_id_foreign" foreign key ("admin_validated_by_id") references "user" ("user_id") on update cascade on delete set null;');

    this.addSql('alter table "content" add constraint "content_author_id_foreign" foreign key ("author_id") references "user" ("user_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content" add constraint "content_parent_id_foreign" foreign key ("parent_id") references "content" ("content_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content" add constraint "content_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("content_master_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content" add constraint "content_last_edit_id_foreign" foreign key ("last_edit_id") references "content_edit" ("content_edit_id") on update cascade on delete set null;');

    this.addSql('alter table "vote" add constraint "vote_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "vote" add constraint "vote_content_id_foreign" foreign key ("content_id") references "content" ("content_id") on update cascade on delete CASCADE;');

    this.addSql('alter table "attachment" add constraint "attachment_file_id_foreign" foreign key ("file_id") references "file_upload" ("file_upload_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "attachment" add constraint "attachment_content_id_foreign" foreign key ("content_id") references "content" ("content_id") on update cascade on delete set null;');

    this.addSql('alter table "content_edit" add constraint "content_edit_parent_id_foreign" foreign key ("parent_id") references "content" ("content_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "content_edit" add constraint "content_edit_edited_by_id_foreign" foreign key ("edited_by_id") references "user" ("user_id") on update cascade on delete CASCADE;');

    this.addSql('alter table "content_master_participants" add constraint "content_master_participants_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("content_master_id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_participants" add constraint "content_master_participants_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete cascade;');

    this.addSql('alter table "content_master_assignees" add constraint "content_master_assignees_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("content_master_id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_assignees" add constraint "content_master_assignees_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete cascade;');

    this.addSql('alter table "content_master_tags" add constraint "content_master_tags_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("content_master_id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_tags" add constraint "content_master_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("name") on update cascade on delete cascade;');

    this.addSql('alter table "doc_series_tags" add constraint "doc_series_tags_doc_series_id_foreign" foreign key ("doc_series_id") references "doc_series" ("doc_series_id") on update cascade on delete cascade;');
    this.addSql('alter table "doc_series_tags" add constraint "doc_series_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("name") on update cascade on delete cascade;');

    this.addSql('alter table "study_doc" add constraint "study_doc_file_id_foreign" foreign key ("file_id") references "file_upload" ("file_upload_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "study_doc" add constraint "study_doc_subject_id_foreign" foreign key ("subject_id") references "subject" ("subject_id") on update cascade;');
    this.addSql('alter table "study_doc" add constraint "study_doc_doc_series_id_foreign" foreign key ("doc_series_id") references "doc_series" ("doc_series_id") on update cascade on delete CASCADE;');

    this.addSql('alter table "statistics" add constraint "statistics_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete cascade;');

    this.addSql('alter table "report" add constraint "report_reporter_id_foreign" foreign key ("reporter_id") references "user" ("user_id") on update cascade;');
    this.addSql('alter table "report" add constraint "report_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "report" add constraint "report_content_id_foreign" foreign key ("content_id") references "content" ("content_id") on update cascade on delete CASCADE;');

    this.addSql('alter table "reaction" add constraint "reaction_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "reaction" add constraint "reaction_content_id_foreign" foreign key ("content_id") references "content" ("content_id") on update cascade on delete CASCADE;');

    this.addSql('alter table "favorite" add constraint "favorite_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "favorite" add constraint "favorite_content_id_foreign" foreign key ("content_id") references "content" ("content_id") on update cascade on delete CASCADE;');
  }

}
