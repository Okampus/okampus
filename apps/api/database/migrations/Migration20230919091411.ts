import { Migration } from '@mikro-orm/migrations';

export class Migration20230919091411 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "project_supervisor" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_scope_id" bigint not null, "title" text null default null, "user_id" bigint not null, "project_id" bigint not null, constraint "project_supervisor_pkey" primary key ("id"));');

    this.addSql('alter table "project_supervisor" add constraint "project_supervisor_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "project_supervisor" add constraint "project_supervisor_tenant_scope_id_foreign" foreign key ("tenant_scope_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "project_supervisor" add constraint "project_supervisor_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "project_supervisor" add constraint "project_supervisor_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('drop table if exists "project_supervisors" cascade;');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'Actor\', \'ActorImage\', \'ActorTag\', \'Address\', \'BankInfo\', \'LegalUnit\', \'LegalUnitLocation\', \'Social\', \'Transaction\', \'Event\', \'EventFavorite\', \'EventJoin\', \'EventOrganize\', \'EventSupervisor\', \'Tenant\', \'Campus\', \'CampusCluster\', \'EventApproval\', \'EventApprovalStep\', \'EventApprovalValidator\', \'RequiredDocument\', \'RequiredRole\', \'TenantMember\', \'TenantMemberRole\', \'TenantRole\', \'Team\', \'Action\', \'BankAccount\', \'Expense\', \'ExpenseItem\', \'Grant\', \'GrantAllocate\', \'Mission\', \'MissionJoin\', \'Project\', \'ProjectSupervisor\', \'TeamDocument\', \'TeamHistory\', \'TeamJoin\', \'TeamMember\', \'TeamMemberRole\', \'TeamRequiredRole\', \'TeamRole\', \'Form\', \'FormSubmission\', \'User\', \'Follow\', \'Session\', \'FileUpload\', \'Location\', \'Tag\'));');
  }

  async down(): Promise<void> {
    this.addSql('create table "project_supervisors" ("project_id" bigint not null, "team_member_id" bigint not null, constraint "project_supervisors_pkey" primary key ("project_id", "team_member_id"));');

    this.addSql('alter table "project_supervisors" add constraint "project_supervisors_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "project_supervisors" add constraint "project_supervisors_team_member_id_foreign" foreign key ("team_member_id") references "team_member" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "project_supervisor" cascade;');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'Actor\', \'ActorImage\', \'ActorTag\', \'Address\', \'BankInfo\', \'LegalUnit\', \'LegalUnitLocation\', \'Social\', \'Transaction\', \'Event\', \'EventFavorite\', \'EventJoin\', \'EventOrganize\', \'EventSupervisor\', \'Tenant\', \'Campus\', \'CampusCluster\', \'EventApproval\', \'EventApprovalStep\', \'EventApprovalValidator\', \'RequiredDocument\', \'RequiredRole\', \'TenantMember\', \'TenantMemberRole\', \'TenantRole\', \'Team\', \'Action\', \'BankAccount\', \'Expense\', \'ExpenseItem\', \'Grant\', \'GrantAllocate\', \'Mission\', \'MissionJoin\', \'Project\', \'TeamDocument\', \'TeamHistory\', \'TeamJoin\', \'TeamMember\', \'TeamMemberRole\', \'TeamRequiredRole\', \'TeamRole\', \'Form\', \'FormSubmission\', \'User\', \'Follow\', \'Session\', \'FileUpload\', \'Location\', \'Tag\'));');
  }

}
