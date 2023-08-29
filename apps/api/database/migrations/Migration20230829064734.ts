import { Migration } from '@mikro-orm/migrations';

export class Migration20230829064734 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" drop constraint "team_cohort_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_class_group_id_foreign";');

    this.addSql('drop table if exists "cohort" cascade;');

    this.addSql('drop table if exists "class_group" cascade;');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "team" drop constraint "team_cohort_id_unique";');
    this.addSql('alter table "team" drop constraint "team_class_group_id_unique";');
    this.addSql('alter table "team" drop column "cohort_id";');
    this.addSql('alter table "team" drop column "class_group_id";');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'User\', \'Tenant\', \'TenantOrganize\', \'Campus\', \'CampusCluster\', \'Actor\', \'BankInfo\', \'Address\', \'Location\', \'ActorImage\', \'LegalUnit\', \'LegalUnitLocation\', \'Social\', \'Tag\', \'Follow\', \'Session\', \'Shortcut\', \'Team\', \'TeamHistory\', \'Action\', \'Mission\', \'MissionJoin\', \'Pole\', \'Role\', \'TeamMemberRole\', \'BankAccount\', \'BankAccountAllocate\', \'Expense\', \'ExpenseItem\', \'Finance\', \'TeamJoin\', \'TeamMember\', \'Grant\', \'GrantAllocate\', \'Project\', \'Event\', \'EventApproval\', \'EventApprovalStep\', \'EventFavorite\', \'EventJoin\', \'EventOrganize\', \'EventSupervisor\', \'FileUpload\', \'Form\', \'FormSubmission\', \'Document\'));');
  }

  async down(): Promise<void> {
    this.addSql('create table "cohort" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "year" smallint not null, constraint "cohort_pkey" primary key ("id"));');

    this.addSql('create table "class_group" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_id" bigint not null, "hidden_at" timestamptz(0) null default null, "description" text not null default \'\', "type" text check ("type" in (\'All\', \'Program\', \'Year\', \'Sector\', \'Class\')) not null, constraint "class_group_pkey" primary key ("id"));');

    this.addSql('alter table "cohort" add constraint "cohort_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "cohort" add constraint "cohort_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "class_group" add constraint "class_group_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "class_group" add constraint "class_group_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade;');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "team" add column "cohort_id" bigint null default null, add column "class_group_id" bigint null default null;');
    this.addSql('alter table "team" add constraint "team_cohort_id_foreign" foreign key ("cohort_id") references "cohort" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_class_group_id_foreign" foreign key ("class_group_id") references "class_group" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_cohort_id_unique" unique ("cohort_id");');
    this.addSql('alter table "team" add constraint "team_class_group_id_unique" unique ("class_group_id");');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'User\', \'Tenant\', \'TenantOrganize\', \'Campus\', \'CampusCluster\', \'Actor\', \'BankInfo\', \'Address\', \'Location\', \'ActorImage\', \'LegalUnit\', \'LegalUnitLocation\', \'Social\', \'Tag\', \'Follow\', \'Session\', \'Shortcut\', \'Team\', \'TeamHistory\', \'Action\', \'Mission\', \'MissionJoin\', \'Pole\', \'Role\', \'TeamMemberRole\', \'BankAccount\', \'BankAccountAllocate\', \'Expense\', \'ExpenseItem\', \'Finance\', \'TeamJoin\', \'TeamMember\', \'Grant\', \'GrantAllocate\', \'ClassGroup\', \'Cohort\', \'Project\', \'Event\', \'EventApproval\', \'EventApprovalStep\', \'EventFavorite\', \'EventJoin\', \'EventOrganize\', \'EventSupervisor\', \'FileUpload\', \'Form\', \'FormSubmission\', \'Document\'));');
  }

}
