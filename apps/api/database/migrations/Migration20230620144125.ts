import { Migration } from '@mikro-orm/migrations';

export class Migration20230620144125 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" add column "legal_unit_id" bigint null default null, add column "tenant_grant_fund_id" bigint null default null;');
    this.addSql('alter table "team" add constraint "team_legal_unit_id_foreign" foreign key ("legal_unit_id") references "legal_unit" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_tenant_grant_fund_id_foreign" foreign key ("tenant_grant_fund_id") references "legal_unit" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team" add constraint "team_legal_unit_id_unique" unique ("legal_unit_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team" drop constraint "team_legal_unit_id_foreign";');
    this.addSql('alter table "team" drop constraint "team_tenant_grant_fund_id_foreign";');

    this.addSql('alter table "team" drop constraint "team_legal_unit_id_unique";');
    this.addSql('alter table "team" drop column "legal_unit_id";');
    this.addSql('alter table "team" drop column "tenant_grant_fund_id";');
  }

}
