import { Migration } from '@mikro-orm/migrations';

export class Migration20230624182257 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "action" drop constraint "action_settled_by_id_foreign";');

    this.addSql('alter table "tenant" add column "oidc_name" text not null default \'\', add column "oidc_client_id" text not null default \'\', add column "oidc_client_secret" text not null default \'\', add column "oidc_discovery_url" text not null default \'\', add column "oidc_scopes" text not null default \'\', add column "oidc_callback_uri" text not null default \'\';');
    this.addSql('alter table "tenant" drop column "oidc_info_oidc_name";');
    this.addSql('alter table "tenant" drop column "oidc_info_oidc_client_id";');
    this.addSql('alter table "tenant" drop column "oidc_info_oidc_client_secret";');
    this.addSql('alter table "tenant" drop column "oidc_info_oidc_discovery_url";');
    this.addSql('alter table "tenant" drop column "oidc_info_oidc_scopes";');
    this.addSql('alter table "tenant" drop column "oidc_info_oidc_callback_uri";');
    this.addSql('alter table "tenant" rename column "oidc_info_is_oidc_enabled" to "is_oidc_enabled";');

    this.addSql('alter table "action" rename column "settled_by_id" to "points_settled_by_id";');
    this.addSql('alter table "action" rename column "settled_at" to "points_settled_at";');
    this.addSql('alter table "action" add constraint "action_points_settled_by_id_foreign" foreign key ("points_settled_by_id") references "individual" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "action" drop constraint "action_points_settled_by_id_foreign";');

    this.addSql('alter table "tenant" add column "oidc_info_oidc_name" text not null default \'\', add column "oidc_info_oidc_client_id" text not null default \'\', add column "oidc_info_oidc_client_secret" text not null default \'\', add column "oidc_info_oidc_discovery_url" text not null default \'\', add column "oidc_info_oidc_scopes" text not null default \'\', add column "oidc_info_oidc_callback_uri" text not null default \'\';');
    this.addSql('alter table "tenant" drop column "oidc_name";');
    this.addSql('alter table "tenant" drop column "oidc_client_id";');
    this.addSql('alter table "tenant" drop column "oidc_client_secret";');
    this.addSql('alter table "tenant" drop column "oidc_discovery_url";');
    this.addSql('alter table "tenant" drop column "oidc_scopes";');
    this.addSql('alter table "tenant" drop column "oidc_callback_uri";');
    this.addSql('alter table "tenant" rename column "is_oidc_enabled" to "oidc_info_is_oidc_enabled";');

    this.addSql('alter table "action" rename column "points_settled_by_id" to "settled_by_id";');
    this.addSql('alter table "action" rename column "points_settled_at" to "settled_at";');
    this.addSql('alter table "action" add constraint "action_settled_by_id_foreign" foreign key ("settled_by_id") references "individual" ("id") on update cascade on delete set null;');
  }

}
