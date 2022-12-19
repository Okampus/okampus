import { Migration } from '@mikro-orm/migrations';

export class Migration20221219044219 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" drop constraint "team_membership_request_form_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_receipt_id_foreign";');

    this.addSql('alter table "app" drop constraint "app_bot_id_foreign";');

    this.addSql('alter table "team" alter column "membership_request_form_id" type int using ("membership_request_form_id"::int);');
    this.addSql('alter table "team" alter column "membership_request_form_id" drop not null;');
    this.addSql('alter table "team" add constraint "team_membership_request_form_id_foreign" foreign key ("membership_request_form_id") references "team_form" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_finance" alter column "receipt_id" type varchar(255) using ("receipt_id"::varchar(255));');
    this.addSql('alter table "team_finance" alter column "receipt_id" drop not null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_receipt_id_foreign" foreign key ("receipt_id") references "file_upload" ("id") on update cascade on delete set null;');

    this.addSql('alter table "app" alter column "bot_id" type varchar(255) using ("bot_id"::varchar(255));');
    this.addSql('alter table "app" alter column "bot_id" drop not null;');
    this.addSql('alter table "app" add constraint "app_bot_id_foreign" foreign key ("bot_id") references "user" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team" drop constraint "team_membership_request_form_id_foreign";');

    this.addSql('alter table "team_finance" drop constraint "team_finance_receipt_id_foreign";');

    this.addSql('alter table "app" drop constraint "app_bot_id_foreign";');

    this.addSql('alter table "team" alter column "membership_request_form_id" type int using ("membership_request_form_id"::int);');
    this.addSql('alter table "team" alter column "membership_request_form_id" set not null;');
    this.addSql('alter table "team" add constraint "team_membership_request_form_id_foreign" foreign key ("membership_request_form_id") references "team_form" ("id") on update cascade;');

    this.addSql('alter table "team_finance" alter column "receipt_id" type varchar(255) using ("receipt_id"::varchar(255));');
    this.addSql('alter table "team_finance" alter column "receipt_id" set not null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_receipt_id_foreign" foreign key ("receipt_id") references "file_upload" ("id") on update cascade;');

    this.addSql('alter table "app" alter column "bot_id" type varchar(255) using ("bot_id"::varchar(255));');
    this.addSql('alter table "app" alter column "bot_id" set not null;');
    this.addSql('alter table "app" add constraint "app_bot_id_foreign" foreign key ("bot_id") references "user" ("id") on update cascade;');
  }

}
