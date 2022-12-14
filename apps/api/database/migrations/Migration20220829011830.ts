import { Migration } from '@mikro-orm/migrations';

export class Migration20220829011830 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team_history" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "day" int null, "month" int null, "year" int not null, "name" varchar(255) not null, "parent_id" int null, "team_id" int not null, "state" varchar(255) not null, "active" boolean not null);');

    this.addSql('alter table "team_history" add constraint "team_history_parent_id_foreign" foreign key ("parent_id") references "team" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_history" add constraint "team_history_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "badge" drop constraint if exists "badge_level_check";');
    this.addSql('alter table "badge" drop constraint if exists "badge_statistic_check";');

    this.addSql('alter table "food" drop constraint if exists "food_type_check";');

    this.addSql('alter table "metric" drop constraint if exists "metric_name_check";');

    this.addSql('alter table "school_group" drop constraint if exists "school_group_type_check";');

    this.addSql('alter table "tag" drop constraint if exists "tag_color_check";');

    this.addSql('alter table "team" drop constraint if exists "team_kind_check";');

    this.addSql('alter table "team_member" drop constraint if exists "team_member_role_check";');

    this.addSql('alter table "team_membership_request" drop constraint if exists "team_membership_request_role_check";');

    this.addSql('alter table "school_group_membership" drop constraint if exists "school_group_membership_role_check";');

    this.addSql('alter table "file_upload" drop constraint if exists "file_upload_file_kind_check";');

    this.addSql('alter table "team_receipt" drop constraint if exists "team_receipt_payment_method_check";');

    this.addSql('alter table "study_doc" drop constraint if exists "study_doc_type_check";');

    this.addSql('alter table "announcement" drop constraint if exists "announcement_state_check";');

    this.addSql('alter table "content" drop constraint if exists "content_kind_check";');

    this.addSql('alter table "content_master" drop constraint if exists "content_master_kind_check";');
    this.addSql('alter table "content_master" drop constraint if exists "content_master_type_check";');

    this.addSql('alter table "reaction" drop constraint if exists "reaction_value_check";');

    this.addSql('alter table "validation_step" drop constraint if exists "validation_step_type_check";');

    this.addSql('alter table "team_finance" drop constraint if exists "team_finance_type_check";');
    this.addSql('alter table "team_finance" drop constraint if exists "team_finance_category_check";');

    this.addSql('alter table "team_event_registration" drop constraint if exists "team_event_registration_status_check";');

    this.addSql('alter table "badge" alter column "level" type text using ("level"::text);');
    this.addSql('alter table "badge" add constraint "badge_level_check" check ("level" in (\'Bronze\', \'Silver\', \'Gold\', \'Platinum\'));');
    this.addSql('alter table "badge" alter column "statistic" type text using ("statistic"::text);');
    this.addSql('alter table "badge" add constraint "badge_statistic_check" check ("statistic" in (\'Comment\', \'Post\', \'Reply\', \'Upload\'));');

    this.addSql('alter table "food" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "food" add constraint "food_type_check" check ("type" in (\'Starter\', \'Dish\', \'Dessert\'));');

    this.addSql('alter table "metric" alter column "name" type text using ("name"::text);');
    this.addSql('alter table "metric" add constraint "metric_name_check" check ("name" in (\'ClubCount\', \'ClubMembershipCount\', \'ClubUniqueMembershipCount\', \'ClubEventCount\', \'ClubCreatedEventCount\', \'UserCount\'));');

    this.addSql('alter table "school_group" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "school_group" add constraint "school_group_type_check" check ("type" in (\'Everyone\', \'Program\', \'Year\', \'Sector\', \'Class\'));');

    this.addSql('alter table "tag" alter column "color" type text using ("color"::text);');
    this.addSql('alter table "tag" add constraint "tag_color_check" check ("color" in (\'Amber\', \'Blue\', \'Cyan\', \'Emerald\', \'Fuchsia\', \'Gray\', \'Green\', \'Indigo\', \'Lime\', \'Neutral\', \'Orange\', \'Pink\', \'Purple\', \'Red\', \'Rose\', \'Sky\', \'Slate\', \'Stone\', \'Teal\', \'Violet\', \'Yellow\', \'Zinc\'));');

    this.addSql('alter table "team" add column "status" varchar(255) null, add column "presentation_video" varchar(255) null;');
    this.addSql('alter table "team" alter column "kind" type text using ("kind"::text);');
    this.addSql('alter table "team" add constraint "team_kind_check" check ("kind" in (\'SchoolDepartment\', \'Club\'));');

    this.addSql('alter table "team_member" alter column "role" type text using ("role"::text);');
    this.addSql('alter table "team_member" add constraint "team_member_role_check" check ("role" in (\'Owner\', \'Coowner\', \'Treasurer\', \'Secretary\', \'Manager\', \'Member\'));');

    this.addSql('alter table "team_membership_request" alter column "role" type text using ("role"::text);');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_role_check" check ("role" in (\'Owner\', \'Coowner\', \'Treasurer\', \'Secretary\', \'Manager\', \'Member\'));');

    this.addSql('alter table "school_group_membership" alter column "role" type text using ("role"::text);');
    this.addSql('alter table "school_group_membership" add constraint "school_group_membership_role_check" check ("role" in (\'Representative\', \'Substitute\', \'Student\'));');

    this.addSql('alter table "file_upload" alter column "file_kind" type text using ("file_kind"::text);');
    this.addSql('alter table "file_upload" add constraint "file_upload_file_kind_check" check ("file_kind" in (\'ProfileImage\', \'InfoDoc\', \'Attachment\', \'StudyDoc\', \'TeamFile\', \'TeamGallery\', \'TeamReceipt\', \'Tenant\'));');

    this.addSql('alter table "team_receipt" alter column "payment_method" type text using ("payment_method"::text);');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_payment_method_check" check ("payment_method" in (\'Cash\', \'CreditCard\', \'Transfer\', \'Check\', \'MobilePayment\', \'Other\'));');

    this.addSql('alter table "study_doc" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "study_doc" add constraint "study_doc_type_check" check ("type" in (\'ExamDE\', \'ExamCE\', \'ExamCC\', \'ExamDM\', \'ExamTAI\', \'Course\', \'Sheet\', \'Projects\', \'SchoolClass\', \'EprofClass\', \'ClassNote\', \'Other\'));');

    this.addSql('alter table "announcement" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "announcement" add constraint "announcement_state_check" check ("state" in (\'Draft\', \'Committed\', \'Hidden\'));');

    this.addSql('alter table "content" alter column "kind" type text using ("kind"::text);');
    this.addSql('alter table "content" add constraint "content_kind_check" check ("kind" in (\'Post\', \'Reply\', \'Comment\'));');

    this.addSql('alter table "content_master" alter column "kind" type text using ("kind"::text);');
    this.addSql('alter table "content_master" add constraint "content_master_kind_check" check ("kind" in (\'Blog\', \'Thread\'));');
    this.addSql('alter table "content_master" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "content_master" add constraint "content_master_type_check" check ("type" in (\'Question\', \'Suggestion\', \'Problem\', \'Discussion\', \'Other\'));');

    this.addSql('alter table "reaction" alter column "value" type text using ("value"::text);');
    this.addSql('alter table "reaction" add constraint "reaction_value_check" check ("value" in (\'What\', \'Interesting\', \'Like\', \'NotAnIssue\', \'Bump\', \'Laugh\', \'Unsure\', \'Partial\', \'Perfect\'));');

    this.addSql('alter table "validation_step" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "validation_step" add constraint "validation_step_type_check" check ("type" in (\'TeamEvent\'));');

    this.addSql('alter table "team_finance" add column "method" text check ("method" in (\'Cash\', \'CreditCard\', \'Transfer\', \'Check\', \'MobilePayment\', \'Other\')) not null;');
    this.addSql('alter table "team_finance" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_finance" add constraint "team_finance_type_check" check ("type" in (\'Expense\', \'Income\'));');
    this.addSql('alter table "team_finance" alter column "category" type text using ("category"::text);');
    this.addSql('alter table "team_finance" add constraint "team_finance_category_check" check ("category" in (\'Entertainment\', \'Equipement\', \'Errands\', \'Fees\', \'Insurance\', \'Logistics\', \'Marketing\', \'Provider\', \'Subscriptions\', \'Transportation\', \'Other\'));');
    this.addSql('alter table "team_finance" drop column "means";');

    this.addSql('alter table "team_event_registration" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_status_check" check ("status" in (\'Sure\', \'Maybe\', \'Absent\'));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "team_history" cascade;');

    this.addSql('alter table "badge" drop constraint if exists "badge_level_check";');
    this.addSql('alter table "badge" drop constraint if exists "badge_statistic_check";');

    this.addSql('alter table "food" drop constraint if exists "food_type_check";');

    this.addSql('alter table "metric" drop constraint if exists "metric_name_check";');

    this.addSql('alter table "school_group" drop constraint if exists "school_group_type_check";');

    this.addSql('alter table "tag" drop constraint if exists "tag_color_check";');

    this.addSql('alter table "team" drop constraint if exists "team_kind_check";');

    this.addSql('alter table "team_member" drop constraint if exists "team_member_role_check";');

    this.addSql('alter table "team_membership_request" drop constraint if exists "team_membership_request_role_check";');

    this.addSql('alter table "school_group_membership" drop constraint if exists "school_group_membership_role_check";');

    this.addSql('alter table "file_upload" drop constraint if exists "file_upload_file_kind_check";');

    this.addSql('alter table "team_receipt" drop constraint if exists "team_receipt_payment_method_check";');

    this.addSql('alter table "study_doc" drop constraint if exists "study_doc_type_check";');

    this.addSql('alter table "announcement" drop constraint if exists "announcement_state_check";');

    this.addSql('alter table "content" drop constraint if exists "content_kind_check";');

    this.addSql('alter table "content_master" drop constraint if exists "content_master_kind_check";');
    this.addSql('alter table "content_master" drop constraint if exists "content_master_type_check";');

    this.addSql('alter table "reaction" drop constraint if exists "reaction_value_check";');

    this.addSql('alter table "validation_step" drop constraint if exists "validation_step_type_check";');

    this.addSql('alter table "team_finance" drop constraint if exists "team_finance_type_check";');
    this.addSql('alter table "team_finance" drop constraint if exists "team_finance_category_check";');

    this.addSql('alter table "team_event_registration" drop constraint if exists "team_event_registration_status_check";');

    this.addSql('alter table "badge" alter column "level" type smallint using ("level"::smallint);');
    this.addSql('alter table "badge" alter column "statistic" type text using ("statistic"::text);');
    this.addSql('alter table "badge" add constraint "badge_statistic_check" check ("statistic" in (\'comment\', \'post\', \'reply\', \'upload\'));');

    this.addSql('alter table "food" alter column "type" type smallint using ("type"::smallint);');

    this.addSql('alter table "metric" alter column "name" type text using ("name"::text);');
    this.addSql('alter table "metric" add constraint "metric_name_check" check ("name" in (\'clubCount\', \'clubMembershipCount\', \'clubUniqueMembershipCount\', \'clubEventCount\', \'clubCreatedEventCount\', \'userCount\'));');

    this.addSql('alter table "school_group" alter column "type" type smallint using ("type"::smallint);');

    this.addSql('alter table "tag" alter column "color" type text using ("color"::text);');
    this.addSql('alter table "tag" add constraint "tag_color_check" check ("color" in (\'amber\', \'blue\', \'cyan\', \'emerald\', \'fuchsia\', \'gray\', \'green\', \'indigo\', \'lime\', \'neutral\', \'orange\', \'pink\', \'purple\', \'red\', \'rose\', \'sky\', \'slate\', \'stone\', \'teal\', \'violet\', \'yellow\', \'zinc\'));');

    this.addSql('alter table "team" alter column "kind" type text using ("kind"::text);');
    this.addSql('alter table "team" add constraint "team_kind_check" check ("kind" in (\'department\', \'club\'));');
    this.addSql('alter table "team" drop column "status";');
    this.addSql('alter table "team" drop column "presentation_video";');

    this.addSql('alter table "team_member" alter column "role" type text using ("role"::text);');
    this.addSql('alter table "team_member" add constraint "team_member_role_check" check ("role" in (\'owner\', \'coowner\', \'treasurer\', \'secretary\', \'manager\', \'member\'));');

    this.addSql('alter table "team_membership_request" alter column "role" type text using ("role"::text);');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_role_check" check ("role" in (\'owner\', \'coowner\', \'treasurer\', \'secretary\', \'manager\', \'member\'));');

    this.addSql('alter table "school_group_membership" alter column "role" type smallint using ("role"::smallint);');

    this.addSql('alter table "file_upload" alter column "file_kind" type text using ("file_kind"::text);');
    this.addSql('alter table "file_upload" add constraint "file_upload_file_kind_check" check ("file_kind" in (\'profile-image\', \'info-doc\', \'attachment\', \'study-doc\', \'team-file\', \'team-gallery\', \'team-receipt\', \'tenant\'));');

    this.addSql('alter table "team_receipt" alter column "payment_method" type text using ("payment_method"::text);');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_payment_method_check" check ("payment_method" in (\'Cash\', \'CreditCard\', \'Transfer\', \'Check\', \'MobilePayment\'));');

    this.addSql('alter table "study_doc" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "study_doc" add constraint "study_doc_type_check" check ("type" in (\'examDE\', \'examCE\', \'examCC\', \'examDM\', \'examTAI\', \'course\', \'sheet\', \'projects\', \'schoolClass\', \'eprofClass\', \'classNote\', \'other\'));');

    this.addSql('alter table "announcement" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "announcement" add constraint "announcement_state_check" check ("state" in (\'draft\', \'committed\', \'hidden\'));');

    this.addSql('alter table "content" alter column "kind" type smallint using ("kind"::smallint);');

    this.addSql('alter table "content_master" alter column "kind" type text using ("kind"::text);');
    this.addSql('alter table "content_master" add constraint "content_master_kind_check" check ("kind" in (\'blog\', \'thread\'));');
    this.addSql('alter table "content_master" alter column "type" type smallint using ("type"::smallint);');

    this.addSql('alter table "reaction" alter column "value" type text using ("value"::text);');
    this.addSql('alter table "reaction" add constraint "reaction_value_check" check ("value" in (\'what\', \'interesting\', \'like\', \'not-an-issue\', \'bump\', \'laugh\', \'unsure\', \'partial\', \'perfect\'));');

    this.addSql('alter table "validation_step" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "validation_step" add constraint "validation_step_type_check" check ("type" in (\'team-event\'));');

    this.addSql('alter table "team_finance" add column "means" text check ("means" in (\'cash\', \'card\', \'transfer\', \'check\', \'other\')) not null;');
    this.addSql('alter table "team_finance" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_finance" add constraint "team_finance_type_check" check ("type" in (\'expense\', \'income\'));');
    this.addSql('alter table "team_finance" alter column "category" type smallint using ("category"::smallint);');
    this.addSql('alter table "team_finance" drop column "method";');

    this.addSql('alter table "team_event_registration" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_status_check" check ("status" in (\'sure\', \'maybe\', \'absent\'));');
  }

}
