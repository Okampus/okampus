import { Migration } from '@mikro-orm/migrations';

export class Migration20220726163742 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team_event_validation" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "event_id" int not null, "user_id" varchar(255) not null, "message" text null, "approved" boolean not null, "step_id" int not null);');

    this.addSql('alter table "team_event_validation" add constraint "team_event_validation_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade;');
    this.addSql('alter table "team_event_validation" add constraint "team_event_validation_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "team_event_validation" add constraint "team_event_validation_step_id_foreign" foreign key ("step_id") references "validation_step" ("id") on update cascade;');

    this.addSql('alter table "team_event" drop constraint if exists "team_event_state_check";');

    this.addSql('alter table "team_event" add column "validation_step" int not null;');
    this.addSql('alter table "team_event" alter column "state" drop default;');
    this.addSql('alter table "team_event" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "team_event" add constraint "team_event_state_check" check ("state" in (\'template\', \'draft\', \'submitted\', \'rejected\', \'published\'));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "team_event_validation" cascade;');

    this.addSql('alter table "team_event" drop constraint if exists "team_event_state_check";');

    this.addSql('alter table "team_event" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "team_event" add constraint "team_event_state_check" check ("state" in (\'template\', \'draft\', \'published\', \'approved\', \'rejected\'));');
    this.addSql('alter table "team_event" alter column "state" set default \'published\';');
    this.addSql('alter table "team_event" drop column "validation_step";');
  }

}
