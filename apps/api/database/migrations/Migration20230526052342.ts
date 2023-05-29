import { Migration } from '@mikro-orm/migrations';

export class Migration20230526052342 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_finance_edit" add column "name" text null default null, add column "description" text null default null, add column "amount" real null default null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_finance_edit" drop column "name";');
    this.addSql('alter table "team_finance_edit" drop column "description";');
    this.addSql('alter table "team_finance_edit" drop column "amount";');
  }

}
