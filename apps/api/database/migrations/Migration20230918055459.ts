import { Migration } from '@mikro-orm/migrations';

export class Migration20230918055459 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event_join" drop constraint "event_join_mission_join_id_foreign";');

    this.addSql('alter table "event_join" drop column "mission_join_id";');

    this.addSql('alter table "mission_join" drop constraint "mission_join_event_join_id_unique";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "mission_join" add constraint "mission_join_event_join_id_unique" unique ("event_join_id");');

    this.addSql('alter table "event_join" add column "mission_join_id" bigint null default null;');
    this.addSql('alter table "event_join" add constraint "event_join_mission_join_id_foreign" foreign key ("mission_join_id") references "mission_join" ("id") on update cascade on delete set null;');
  }

}
