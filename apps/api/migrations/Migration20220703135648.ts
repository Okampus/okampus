import { Migration } from '@mikro-orm/migrations';

export class Migration20220703135648 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_metric" drop constraint if exists "team_metric_value_check";');
    this.addSql('alter table "team_metric" alter column "value" type real using ("value"::real);');


    this.addSql('alter table "team_event" rename column "short_description" to "name";');
    this.addSql('alter table "team_event" rename column "long_description" to "description";');

    this.addSql('alter table "team_event" add column "state" text check ("state" in (\'draft\', \'published\')) not null default \'published\';');


    this.addSql('create table "team_form" ("team_form_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" text null, "form" jsonb not null, "created_by_id" varchar(255) not null, "team_id" int4 not null);');
    this.addSql('create index "team_form_team_id_index" on "team_form" ("team_id");');

    this.addSql('alter table "team_form" add constraint "team_form_created_by_id_foreign" foreign key ("created_by_id") references "user" ("user_id") on update cascade;');
    this.addSql('alter table "team_form" add constraint "team_form_team_id_foreign" foreign key ("team_id") references "team" ("team_id") on update cascade on delete CASCADE;');

    this.addSql('alter table "team_form" add column "is_template" bool not null;');
  }

}
