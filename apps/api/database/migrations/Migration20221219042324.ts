import { Migration } from '@mikro-orm/migrations';

export class Migration20221219042324 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_finance" drop constraint "team_finance_receipt_id_foreign";');

    this.addSql('alter table "team_finance" add column "amount_payed" int null, add column "location" text null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_receipt_id_foreign" foreign key ("receipt_id") references "file_upload" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_finance" drop constraint "team_finance_receipt_id_foreign";');

    this.addSql('alter table "team_finance" drop column "amount_payed";');
    this.addSql('alter table "team_finance" drop column "location";');
    this.addSql('alter table "team_finance" add constraint "team_finance_receipt_id_foreign" foreign key ("receipt_id") references "team_file" ("id") on update cascade;');
  }

}
