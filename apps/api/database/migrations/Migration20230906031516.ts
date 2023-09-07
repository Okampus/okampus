import { Migration } from '@mikro-orm/migrations';

export class Migration20230906031516 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "tenant_organize" cascade;');

    this.addSql('drop table if exists "pole" cascade;');

    this.addSql('alter table "team" drop constraint if exists "team_type_check";');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "tenant_member" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "team" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team" add constraint "team_type_check" check ("type" in (\'AdminTeam\', \'Association\', \'Club\', \'Project\'));');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'User\', \'Session\', \'Tenant\', \'TenantMember\', \'TenantMemberRole\', \'TenantRole\', \'Campus\', \'CampusCluster\', \'Actor\', \'ActorImage\', \'ActorTag\', \'Address\', \'BankInfo\', \'Transaction\', \'Location\', \'LegalUnit\', \'LegalUnitLocation\', \'Social\', \'Tag\', \'Follow\', \'Team\', \'TeamDocument\', \'TeamHistory\', \'TeamJoin\', \'TeamMember\', \'TeamMemberRole\', \'TeamRole\', \'Action\', \'Mission\', \'MissionJoin\', \'Pole\', \'BankAccount\', \'Expense\', \'ExpenseItem\', \'Grant\', \'GrantAllocate\', \'Project\', \'Event\', \'EventApproval\', \'EventApprovalStep\', \'EventFavorite\', \'EventJoin\', \'EventOrganize\', \'EventSupervisor\', \'FileUpload\', \'Form\', \'FormSubmission\'));');
  }

  async down(): Promise<void> {
    this.addSql('create table "tenant_organize" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_scope_id" bigint not null, "hidden_at" timestamptz(0) null default null, "campus_cluster_id" bigint not null, "team_id" bigint not null, "type" text check ("type" in (\'Admin\', \'ClusterManager\')) not null, constraint "tenant_organize_pkey" primary key ("id"));');

    this.addSql('create table "pole" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_scope_id" bigint not null, "hidden_at" timestamptz(0) null default null, "team_id" bigint not null, "name" text not null, "description" text not null, "is_locked" boolean not null default false, "category" text check ("category" in (\'Administration\', \'Communication\', \'Members\', \'Relations\', \'Activity\')) not null, constraint "pole_pkey" primary key ("id"));');

    this.addSql('alter table "tenant_organize" add constraint "tenant_organize_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "tenant_organize" add constraint "tenant_organize_tenant_scope_id_foreign" foreign key ("tenant_scope_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "tenant_organize" add constraint "tenant_organize_campus_cluster_id_foreign" foreign key ("campus_cluster_id") references "campus_cluster" ("id") on update cascade;');
    this.addSql('alter table "tenant_organize" add constraint "tenant_organize_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "pole" add constraint "pole_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "pole" add constraint "pole_tenant_scope_id_foreign" foreign key ("tenant_scope_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "pole" add constraint "pole_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');

    this.addSql('alter table "team" drop constraint if exists "team_type_check";');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "tenant_member" drop column "hidden_at";');

    this.addSql('alter table "team" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team" add constraint "team_type_check" check ("type" in (\'AdminTeam\', \'Association\', \'Club\', \'Project\', \'Department\'));');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'User\', \'Session\', \'Tenant\', \'TenantMember\', \'TenantMemberRole\', \'TenantRole\', \'TenantOrganize\', \'Campus\', \'CampusCluster\', \'Actor\', \'ActorImage\', \'ActorTag\', \'Address\', \'BankInfo\', \'Transaction\', \'Location\', \'LegalUnit\', \'LegalUnitLocation\', \'Social\', \'Tag\', \'Follow\', \'Team\', \'TeamDocument\', \'TeamHistory\', \'TeamJoin\', \'TeamMember\', \'TeamMemberRole\', \'TeamRole\', \'Action\', \'Mission\', \'MissionJoin\', \'Pole\', \'BankAccount\', \'Expense\', \'ExpenseItem\', \'Grant\', \'GrantAllocate\', \'Project\', \'Event\', \'EventApproval\', \'EventApprovalStep\', \'EventFavorite\', \'EventJoin\', \'EventOrganize\', \'EventSupervisor\', \'FileUpload\', \'Form\', \'FormSubmission\'));');
  }

}
