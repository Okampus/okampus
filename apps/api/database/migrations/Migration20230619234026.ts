import { Migration } from '@mikro-orm/migrations';

export class Migration20230619234026 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "grant" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "amount_asked" real not null, "amount_given" real not null, "state" text check ("state" in (\'Canceled\', \'Ongoing\', \'Completed\')) not null default \'Completed\', "validated_by_id" bigint null default null, "validated_at" timestamptz(0) null default null, "team_id" bigint not null, "signature_id" bigint null default null, "generated_document_id" bigint null default null, constraint "grant_pkey" primary key ("id"));');

    this.addSql('create table "grant_attachments" ("grant_id" bigint not null, "file_upload_id" bigint not null, constraint "grant_attachments_pkey" primary key ("grant_id", "file_upload_id"));');

    this.addSql('create table "grant_unlock" ("id" bigint not null default "public"."id_generator"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "amount_asked" real not null, "amount_given" real not null, "state" text check ("state" in (\'Canceled\', \'Ongoing\', \'Completed\')) not null default \'Completed\', "validated_by_id" bigint null default null, "validated_at" timestamptz(0) null default null, "grant_id" bigint not null, "finance_id" bigint null default null, "signature_id" bigint null default null, "generated_document_id" bigint null default null, constraint "grant_unlock_pkey" primary key ("id"));');

    this.addSql('create table "grant_unlock_attachments" ("grant_unlock_id" bigint not null, "file_upload_id" bigint not null, constraint "grant_unlock_attachments_pkey" primary key ("grant_unlock_id", "file_upload_id"));');

    this.addSql('alter table "grant" add constraint "grant_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant" add constraint "grant_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "grant" add constraint "grant_validated_by_id_foreign" foreign key ("validated_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant" add constraint "grant_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "grant" add constraint "grant_signature_id_foreign" foreign key ("signature_id") references "file_upload" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant" add constraint "grant_generated_document_id_foreign" foreign key ("generated_document_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "grant_attachments" add constraint "grant_attachments_grant_id_foreign" foreign key ("grant_id") references "grant" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "grant_attachments" add constraint "grant_attachments_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "grant_unlock" add constraint "grant_unlock_created_by_id_foreign" foreign key ("created_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant_unlock" add constraint "grant_unlock_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "grant_unlock" add constraint "grant_unlock_validated_by_id_foreign" foreign key ("validated_by_id") references "individual" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant_unlock" add constraint "grant_unlock_grant_id_foreign" foreign key ("grant_id") references "grant" ("id") on update cascade;');
    this.addSql('alter table "grant_unlock" add constraint "grant_unlock_finance_id_foreign" foreign key ("finance_id") references "finance" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant_unlock" add constraint "grant_unlock_signature_id_foreign" foreign key ("signature_id") references "file_upload" ("id") on update cascade on delete set null;');
    this.addSql('alter table "grant_unlock" add constraint "grant_unlock_generated_document_id_foreign" foreign key ("generated_document_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "grant_unlock_attachments" add constraint "grant_unlock_attachments_grant_unlock_id_foreign" foreign key ("grant_unlock_id") references "grant_unlock" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "grant_unlock_attachments" add constraint "grant_unlock_attachments_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "project" drop constraint "project_image_id_foreign";');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "project" add column "grant_id" bigint null default null;');
    this.addSql('alter table "project" add constraint "project_grant_id_foreign" foreign key ("grant_id") references "grant" ("id") on update cascade on delete set null;');
    this.addSql('alter table "project" add constraint "project_image_id_foreign" foreign key ("image_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'Individual\', \'BotInfo\', \'UserInfo\', \'Tenant\', \'Campus\', \'Actor\', \'ActorBankInfo\', \'ActorAddress\', \'ActorImage\', \'LegalUnit\', \'Social\', \'Tag\', \'Follow\', \'Session\', \'Shortcut\', \'Team\', \'Action\', \'Mission\', \'MissionJoin\', \'Pole\', \'Role\', \'Expense\', \'ExpenseItem\', \'Finance\', \'TeamJoin\', \'TeamMember\', \'TeamMetric\', \'Grant\', \'GrantUnlock\', \'Canteen\', \'CanteenFood\', \'CanteenMenu\', \'ClassGroup\', \'ClassGroupTeacher\', \'Cohort\', \'Project\', \'Event\', \'EventManage\', \'EventJoin\', \'FileUpload\', \'Favorite\', \'Reaction\', \'Report\', \'Validation\', \'Vote\', \'EventApproval\', \'EventApprovalStep\', \'Content\', \'ContentMaster\', \'Issue\', \'Document\', \'Subject\', \'Form\', \'FormSubmission\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" drop constraint "project_grant_id_foreign";');

    this.addSql('alter table "grant_attachments" drop constraint "grant_attachments_grant_id_foreign";');

    this.addSql('alter table "grant_unlock" drop constraint "grant_unlock_grant_id_foreign";');

    this.addSql('alter table "grant_unlock_attachments" drop constraint "grant_unlock_attachments_grant_unlock_id_foreign";');

    this.addSql('drop table if exists "grant" cascade;');

    this.addSql('drop table if exists "grant_attachments" cascade;');

    this.addSql('drop table if exists "grant_unlock" cascade;');

    this.addSql('drop table if exists "grant_unlock_attachments" cascade;');

    this.addSql('alter table "project" drop constraint "project_image_id_foreign";');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "project" drop column "grant_id";');
    this.addSql('alter table "project" add constraint "project_image_id_foreign" foreign key ("image_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'Individual\', \'BotInfo\', \'UserInfo\', \'Tenant\', \'Campus\', \'Actor\', \'ActorBankInfo\', \'ActorAddress\', \'ActorImage\', \'LegalUnit\', \'Social\', \'Tag\', \'Follow\', \'Session\', \'Shortcut\', \'Team\', \'Action\', \'Mission\', \'MissionJoin\', \'Pole\', \'Role\', \'Expense\', \'ExpenseItem\', \'Finance\', \'TeamJoin\', \'TeamMember\', \'TeamMetric\', \'Canteen\', \'CanteenFood\', \'CanteenMenu\', \'ClassGroup\', \'ClassGroupTeacher\', \'Cohort\', \'Project\', \'Event\', \'EventManage\', \'EventJoin\', \'FileUpload\', \'Favorite\', \'Reaction\', \'Report\', \'Validation\', \'Vote\', \'EventApproval\', \'EventApprovalStep\', \'Content\', \'ContentMaster\', \'Issue\', \'Document\', \'Subject\', \'Form\', \'FormSubmission\'));');
  }

}
