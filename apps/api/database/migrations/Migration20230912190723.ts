import { Migration } from '@mikro-orm/migrations';

export class Migration20230912190723 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant_role" drop column "hidden_at";');

    this.addSql('alter table "tenant_member" drop column "hidden_at";');

    this.addSql('alter table "tenant_member_role" drop column "hidden_at";');

    this.addSql('alter table "session" drop column "hidden_at";');

    this.addSql('alter table "form_submission" drop column "hidden_at";');

    this.addSql('alter table "event_favorite" drop column "hidden_at";');

    this.addSql('alter table "team_role" drop column "hidden_at";');

    this.addSql('alter table "team_member" drop column "hidden_at";');

    this.addSql('alter table "team_required_role" drop column "hidden_at";');

    this.addSql('alter table "team_member_role" drop column "hidden_at";');

    this.addSql('alter table "team_join" drop column "hidden_at";');

    this.addSql('alter table "team_history" drop column "hidden_at";');

    this.addSql('alter table "team_document" drop column "hidden_at";');

    this.addSql('alter table "grant" drop column "hidden_at";');

    this.addSql('alter table "event_organize" drop column "hidden_at";');

    this.addSql('alter table "mission" drop column "hidden_at";');

    this.addSql('alter table "mission_join" drop column "hidden_at";');

    this.addSql('alter table "event_join" drop column "hidden_at";');

    this.addSql('alter table "event_supervisor" drop column "hidden_at";');

    this.addSql('alter table "follow" drop column "hidden_at";');

    this.addSql('alter table "expense_item" drop column "hidden_at";');

    this.addSql('alter table "bank_account" drop column "hidden_at";');

    this.addSql('alter table "grant_allocate" drop column "hidden_at";');

    this.addSql('alter table "action" drop column "hidden_at";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant_role" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "tenant_member" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "tenant_member_role" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "session" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "form_submission" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "event_favorite" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "team_role" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "team_member" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "team_required_role" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "team_member_role" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "team_join" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "team_history" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "team_document" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "grant" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "event_organize" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "mission" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "mission_join" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "event_join" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "event_supervisor" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "follow" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "expense_item" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "bank_account" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "grant_allocate" add column "hidden_at" timestamptz(0) null default null;');

    this.addSql('alter table "action" add column "hidden_at" timestamptz(0) null default null;');
  }

}
