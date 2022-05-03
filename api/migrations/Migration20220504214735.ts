import { Migration } from '@mikro-orm/migrations';

export class Migration20220504214735 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team_event" ("team_event_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "short_description" text not null, "long_description" text not null, "price" int4 not null, "created_by_id" varchar(255) not null, "team_id" int4 not null, "place" text not null, "meeting_point" text null, "supervisor_id" varchar(255) null, "private" bool not null, "preconditions" text null, "question_fallback" text null, "link" text null);');

    this.addSql('alter table "team_event" add constraint "team_event_created_by_id_foreign" foreign key ("created_by_id") references "user" ("user_id") on update cascade;');
    this.addSql('alter table "team_event" add constraint "team_event_team_id_foreign" foreign key ("team_id") references "team" ("team_id") on update cascade;');
    this.addSql('alter table "team_event" add constraint "team_event_supervisor_id_foreign" foreign key ("supervisor_id") references "user" ("user_id") on update cascade on delete set null;');
  }

}
