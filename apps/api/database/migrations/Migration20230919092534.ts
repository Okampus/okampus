import { Migration } from '@mikro-orm/migrations';

export class Migration20230919092534 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event_supervisor" drop constraint "event_supervisor_team_member_id_foreign";');

    this.addSql('alter table "event_supervisor" rename column "team_member_id" to "user_id";');
    this.addSql('alter table "event_supervisor" add constraint "event_supervisor_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event_supervisor" drop constraint "event_supervisor_user_id_foreign";');

    this.addSql('alter table "event_supervisor" rename column "user_id" to "team_member_id";');
    this.addSql('alter table "event_supervisor" add constraint "event_supervisor_team_member_id_foreign" foreign key ("team_member_id") references "team_member" ("id") on update cascade;');
  }

}
