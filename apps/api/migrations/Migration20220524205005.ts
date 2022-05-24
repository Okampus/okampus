import { Migration } from '@mikro-orm/migrations';

export class Migration20220524205005 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" add column "banner" text null;');

    this.addSql('create table "team_event_registration" ("team_event_registration_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "event_id" int4 not null, "user_id" varchar(255) not null);');

    this.addSql('alter table "team_membership_request" drop constraint if exists "team_membership_request_role_check";');
    this.addSql('alter table "team_membership_request" alter column "role" type text using ("role"::text);');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_role_check" check ("role" in (\'owner\', \'coowner\', \'treasurer\', \'secretary\', \'manager\', \'member\'));');
    this.addSql('alter table "team_membership_request" alter column "role" drop default;');

    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_event_id_foreign" foreign key ("event_id") references "team_event" ("team_event_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete CASCADE;');
  }

}
