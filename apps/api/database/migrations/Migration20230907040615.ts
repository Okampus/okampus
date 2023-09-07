import { Migration } from '@mikro-orm/migrations';

export class Migration20230907040615 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant_role" drop constraint if exists "tenant_role_type_check";');

    this.addSql('alter table "team_role" drop constraint if exists "team_role_type_check";');

    this.addSql('alter table "action" drop constraint "action_team_id_foreign";');

    this.addSql('alter table "tenant_role" add column "can_view_hidden" boolean not null default false, add column "can_hide" boolean not null default false, add column "can_create_team" boolean not null default false, add column "can_manage_campus" boolean not null default false, add column "can_manage_event_approval_steps" boolean not null default false, add column "can_manage_event_approvals" boolean not null default false;');
    this.addSql('alter table "tenant_role" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "tenant_role" add constraint "tenant_role_type_check" check ("type" in (\'President\', \'Treasurer\', \'Secretary\', \'CustomDirectorRole\', \'CustomManagerRole\'));');
    this.addSql('alter table "tenant_role" drop column "permissions";');

    this.addSql('alter table "admin_role" add column "can_create_tenant" boolean not null default false, add column "can_manage_tenant_entities" boolean not null default false, add column "can_delete_tenant_entities" boolean not null default false;');
    this.addSql('alter table "admin_role" drop column "permissions";');

    this.addSql('alter table "event_approval" alter column "is_approved" type boolean using ("is_approved"::boolean);');
    this.addSql('alter table "event_approval" alter column "is_approved" set default true;');

    this.addSql('alter table "legal_unit" alter column "is_franchise" type boolean using ("is_franchise"::boolean);');
    this.addSql('alter table "legal_unit" alter column "is_franchise" set default false;');
    this.addSql('alter table "legal_unit" alter column "is_franchise_brand" type boolean using ("is_franchise_brand"::boolean);');
    this.addSql('alter table "legal_unit" alter column "is_franchise_brand" set default false;');

    this.addSql('alter table "team_role" add column "manager_id" bigint null default null, add column "is_pole" boolean not null default false, add column "can_manage_profile" boolean not null default false, add column "can_view_treasury" boolean not null default false, add column "can_manage_treasury" boolean not null default false, add column "can_view_joins" boolean not null default false, add column "can_manage_joins" boolean not null default false, add column "can_manage_member_roles" boolean not null default false, add column "can_manage_roles" boolean not null default false, add column "can_create_events" boolean not null default false, add column "can_manage_events" boolean not null default false, add column "can_view_draft_events" boolean not null default false, add column "can_create_actions" boolean not null default false, add column "can_manage_actions" boolean not null default false, add column "can_create_contents" boolean not null default false, add column "can_manage_contents" boolean not null default false;');
    this.addSql('alter table "team_role" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_role" add constraint "team_role_type_check" check ("type" in (\'President\', \'Treasurer\', \'Secretary\', \'CustomDirectorRole\', \'CustomManagerRole\'));');
    this.addSql('alter table "team_role" add constraint "team_role_manager_id_foreign" foreign key ("manager_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_role" drop column "permissions";');

    this.addSql('alter table "action" alter column "team_id" type bigint using ("team_id"::bigint);');
    this.addSql('alter table "action" alter column "team_id" drop not null;');
    this.addSql('alter table "action" add constraint "action_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant_role" drop constraint if exists "tenant_role_type_check";');

    this.addSql('alter table "team_role" drop constraint if exists "team_role_type_check";');

    this.addSql('alter table "team_role" drop constraint "team_role_manager_id_foreign";');

    this.addSql('alter table "action" drop constraint "action_team_id_foreign";');

    this.addSql('alter table "tenant_role" add column "permissions" text[] not null default \'{}\';');
    this.addSql('alter table "tenant_role" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "tenant_role" add constraint "tenant_role_type_check" check ("type" in (\'Director\', \'Treasurer\', \'Secretary\', \'Manager\'));');
    this.addSql('alter table "tenant_role" drop column "can_view_hidden";');
    this.addSql('alter table "tenant_role" drop column "can_hide";');
    this.addSql('alter table "tenant_role" drop column "can_create_team";');
    this.addSql('alter table "tenant_role" drop column "can_manage_campus";');
    this.addSql('alter table "tenant_role" drop column "can_manage_event_approval_steps";');
    this.addSql('alter table "tenant_role" drop column "can_manage_event_approvals";');

    this.addSql('alter table "admin_role" add column "permissions" text[] not null default \'{}\';');
    this.addSql('alter table "admin_role" drop column "can_create_tenant";');
    this.addSql('alter table "admin_role" drop column "can_manage_tenant_entities";');
    this.addSql('alter table "admin_role" drop column "can_delete_tenant_entities";');

    this.addSql('alter table "legal_unit" alter column "is_franchise" drop default;');
    this.addSql('alter table "legal_unit" alter column "is_franchise" type boolean using ("is_franchise"::boolean);');
    this.addSql('alter table "legal_unit" alter column "is_franchise_brand" drop default;');
    this.addSql('alter table "legal_unit" alter column "is_franchise_brand" type boolean using ("is_franchise_brand"::boolean);');

    this.addSql('alter table "team_role" add column "permissions" text[] not null default \'{}\';');
    this.addSql('alter table "team_role" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_role" add constraint "team_role_type_check" check ("type" in (\'Director\', \'Treasurer\', \'Secretary\', \'Manager\'));');
    this.addSql('alter table "team_role" drop column "manager_id";');
    this.addSql('alter table "team_role" drop column "is_pole";');
    this.addSql('alter table "team_role" drop column "can_manage_profile";');
    this.addSql('alter table "team_role" drop column "can_view_treasury";');
    this.addSql('alter table "team_role" drop column "can_manage_treasury";');
    this.addSql('alter table "team_role" drop column "can_view_joins";');
    this.addSql('alter table "team_role" drop column "can_manage_joins";');
    this.addSql('alter table "team_role" drop column "can_manage_member_roles";');
    this.addSql('alter table "team_role" drop column "can_manage_roles";');
    this.addSql('alter table "team_role" drop column "can_create_events";');
    this.addSql('alter table "team_role" drop column "can_manage_events";');
    this.addSql('alter table "team_role" drop column "can_view_draft_events";');
    this.addSql('alter table "team_role" drop column "can_create_actions";');
    this.addSql('alter table "team_role" drop column "can_manage_actions";');
    this.addSql('alter table "team_role" drop column "can_create_contents";');
    this.addSql('alter table "team_role" drop column "can_manage_contents";');

    this.addSql('alter table "action" alter column "team_id" type bigint using ("team_id"::bigint);');
    this.addSql('alter table "action" alter column "team_id" set not null;');
    this.addSql('alter table "action" add constraint "action_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
  }

}
