import { Migration } from '@mikro-orm/migrations';

export class Migration20230906231521 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "event_approval_validator" ("id" bigint not null default "public"."snowflake"(), "created_at" timestamptz(0) not null default current_timestamp, "created_by_id" bigint null default null, "deleted_at" timestamptz(0) null default null, "tenant_scope_id" bigint not null, "hidden_at" timestamptz(0) null default null, "step_id" bigint not null, "user_id" bigint not null, "can_validate" boolean not null default false, "is_notified" boolean not null default false, constraint "event_approval_validator_pkey" primary key ("id"));');

    this.addSql('alter table "event_approval_validator" add constraint "event_approval_validator_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event_approval_validator" add constraint "event_approval_validator_tenant_scope_id_foreign" foreign key ("tenant_scope_id") references "tenant" ("id") on update cascade;');
    this.addSql('alter table "event_approval_validator" add constraint "event_approval_validator_step_id_foreign" foreign key ("step_id") references "event_approval_step" ("id") on update cascade;');
    this.addSql('alter table "event_approval_validator" add constraint "event_approval_validator_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'User\', \'Session\', \'Tenant\', \'TenantMember\', \'TenantMemberRole\', \'TenantRole\', \'Campus\', \'CampusCluster\', \'Actor\', \'ActorImage\', \'ActorTag\', \'Address\', \'BankInfo\', \'Transaction\', \'Location\', \'LegalUnit\', \'LegalUnitLocation\', \'Social\', \'Tag\', \'Follow\', \'Team\', \'TeamDocument\', \'TeamHistory\', \'TeamJoin\', \'TeamMember\', \'TeamMemberRole\', \'TeamRole\', \'Action\', \'Mission\', \'MissionJoin\', \'Pole\', \'BankAccount\', \'Expense\', \'ExpenseItem\', \'Grant\', \'GrantAllocate\', \'Project\', \'Event\', \'EventApproval\', \'EventApprovalStep\', \'EventApprovalValidator\', \'EventFavorite\', \'EventJoin\', \'EventOrganize\', \'EventSupervisor\', \'FileUpload\', \'Form\', \'FormSubmission\'));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "event_approval_validator" cascade;');

    this.addSql('alter table "log" drop constraint if exists "log_entity_name_check";');

    this.addSql('alter table "log" alter column "entity_name" type text using ("entity_name"::text);');
    this.addSql('alter table "log" add constraint "log_entity_name_check" check ("entity_name" in (\'User\', \'Session\', \'Tenant\', \'TenantMember\', \'TenantMemberRole\', \'TenantRole\', \'Campus\', \'CampusCluster\', \'Actor\', \'ActorImage\', \'ActorTag\', \'Address\', \'BankInfo\', \'Transaction\', \'Location\', \'LegalUnit\', \'LegalUnitLocation\', \'Social\', \'Tag\', \'Follow\', \'Team\', \'TeamDocument\', \'TeamHistory\', \'TeamJoin\', \'TeamMember\', \'TeamMemberRole\', \'TeamRole\', \'Action\', \'Mission\', \'MissionJoin\', \'Pole\', \'BankAccount\', \'Expense\', \'ExpenseItem\', \'Grant\', \'GrantAllocate\', \'Project\', \'Event\', \'EventApproval\', \'EventApprovalStep\', \'EventFavorite\', \'EventJoin\', \'EventOrganize\', \'EventSupervisor\', \'FileUpload\', \'Form\', \'FormSubmission\'));');
  }

}
