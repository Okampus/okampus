import { Migration } from '@mikro-orm/migrations';

export class Migration20230905063931 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "bank_info" drop constraint "bank_info_legal_unit_location_id_foreign";');

    this.addSql('alter table "legal_unit" add column "is_franchise" boolean not null, add column "is_franchise_brand" boolean not null;');

    this.addSql('alter table "legal_unit_location" rename column "bank_info_location_code" to "bank_location_code";');

    this.addSql('alter table "bank_info" add column "branch_address_id" bigint not null;');
    this.addSql('alter table "bank_info" add constraint "bank_info_branch_address_id_foreign" foreign key ("branch_address_id") references "address" ("id") on update cascade;');
    this.addSql('alter table "bank_info" rename column "legal_unit_location_id" to "bank_id";');
    this.addSql('alter table "bank_info" add constraint "bank_info_bank_id_foreign" foreign key ("bank_id") references "legal_unit" ("id") on update cascade;');

    this.addSql('alter table "bank_account" alter column "name" type text using ("name"::text);');
    this.addSql('alter table "bank_account" alter column "name" drop not null;');

    this.addSql('alter table "transaction" rename column "payed_by_type" to "initiated_by_type";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "bank_info" drop constraint "bank_info_bank_id_foreign";');
    this.addSql('alter table "bank_info" drop constraint "bank_info_branch_address_id_foreign";');

    this.addSql('alter table "legal_unit" drop column "is_franchise";');
    this.addSql('alter table "legal_unit" drop column "is_franchise_brand";');

    this.addSql('alter table "legal_unit_location" rename column "bank_location_code" to "bank_info_location_code";');

    this.addSql('alter table "bank_info" add column "legal_unit_location_id" bigint not null;');
    this.addSql('alter table "bank_info" add constraint "bank_info_legal_unit_location_id_foreign" foreign key ("legal_unit_location_id") references "legal_unit_location" ("id") on update cascade;');
    this.addSql('alter table "bank_info" drop column "bank_id";');
    this.addSql('alter table "bank_info" drop column "branch_address_id";');

    this.addSql('alter table "bank_account" alter column "name" type text using ("name"::text);');
    this.addSql('alter table "bank_account" alter column "name" set not null;');

    this.addSql('alter table "transaction" rename column "initiated_by_type" to "payed_by_type";');
  }

}
