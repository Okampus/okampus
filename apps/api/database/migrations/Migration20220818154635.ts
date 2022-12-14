import { Migration } from '@mikro-orm/migrations';

export class Migration20220818154635 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant" add column "oidc_enabled" boolean not null, add column "oidc_client_id" varchar(255) null, add column "oidc_client_secret" text null, add column "oidc_discovery_url" text null, add column "oidc_scopes" varchar(255) null, add column "oidc_callback_uri" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant" drop column "oidc_enabled";');
    this.addSql('alter table "tenant" drop column "oidc_client_id";');
    this.addSql('alter table "tenant" drop column "oidc_client_secret";');
    this.addSql('alter table "tenant" drop column "oidc_discovery_url";');
    this.addSql('alter table "tenant" drop column "oidc_scopes";');
    this.addSql('alter table "tenant" drop column "oidc_callback_uri";');
  }

}
