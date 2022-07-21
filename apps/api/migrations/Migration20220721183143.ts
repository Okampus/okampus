import { Migration } from '@mikro-orm/migrations';

export class Migration20220721183143 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team_finance" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "description" text null, "created_by_id" varchar(255) not null, "team_id" int not null, "due_to_id" varchar(255) null, "amount" int not null, "mean" text check ("mean" in (\'cash\', \'card\', \'transfer\', \'check\', \'other\')) not null, "type" text check ("type" in (\'expense\', \'income\')) not null, "category" smallint not null, "event_id" int null, "receipt_id" varchar(255) null);');
    this.addSql('create index "team_finance_team_id_index" on "team_finance" ("team_id");');
    this.addSql('alter table "team_finance" add constraint "team_finance_receipt_id_unique" unique ("receipt_id");');

    this.addSql('alter table "team_finance" add constraint "team_finance_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "team_finance" add constraint "team_finance_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_finance" add constraint "team_finance_due_to_id_foreign" foreign key ("due_to_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_finance" add constraint "team_finance_receipt_id_foreign" foreign key ("receipt_id") references "team_file" ("id") on update cascade on delete set null;');

    this.addSql('alter table "team_file" drop constraint if exists "team_file_type_check";');

    this.addSql('alter table "team_file" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_file" add constraint "team_file_type_check" check ("type" in (\'document\', \'gallery\', \'receipt\'));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "team_finance" cascade;');

    this.addSql('alter table "team_file" drop constraint if exists "team_file_type_check";');

    this.addSql('alter table "team_file" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_file" add constraint "team_file_type_check" check ("type" in (\'gallery\', \'document\'));');
  }

}
