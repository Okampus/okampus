import { Migration } from '@mikro-orm/migrations';

export class Migration20220828194626 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_receipt" drop constraint "team_receipt_payed_by_id_foreign";');

    this.addSql('alter table "team_receipt" add column "payment_method" text check ("payment_method" in (\'Cash\', \'CreditCard\', \'Transfer\', \'Check\', \'MobilePayment\')) null, add column "amount" int not null, add column "amount_payed" int not null;');
    this.addSql('alter table "team_receipt" alter column "payed_by_id" type varchar(255) using ("payed_by_id"::varchar(255));');
    this.addSql('alter table "team_receipt" alter column "payed_by_id" drop not null;');
    this.addSql('alter table "team_receipt" alter column "payment_location" type text using ("payment_location"::text);');
    this.addSql('alter table "team_receipt" alter column "payment_location" drop not null;');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_payed_by_id_foreign" foreign key ("payed_by_id") references "user" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_receipt" drop constraint "team_receipt_payed_by_id_foreign";');

    this.addSql('alter table "team_receipt" alter column "payed_by_id" type varchar(255) using ("payed_by_id"::varchar(255));');
    this.addSql('alter table "team_receipt" alter column "payed_by_id" set not null;');
    this.addSql('alter table "team_receipt" alter column "payment_location" type text using ("payment_location"::text);');
    this.addSql('alter table "team_receipt" alter column "payment_location" set not null;');
    this.addSql('alter table "team_receipt" drop column "payment_method";');
    this.addSql('alter table "team_receipt" drop column "amount";');
    this.addSql('alter table "team_receipt" drop column "amount_payed";');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_payed_by_id_foreign" foreign key ("payed_by_id") references "user" ("id") on update cascade;');
  }

}
