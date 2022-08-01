import { Migration } from '@mikro-orm/migrations';

export class Migration20220801022611 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event_registration" drop constraint if exists "team_event_registration_status_check";');

    this.addSql('alter table "team_event" rename column "place" to "location";');

    this.addSql('alter table "team_event_registration" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_status_check" check ("status" in (\'sure\', \'maybe\', \'absent\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_event_registration" drop constraint if exists "team_event_registration_status_check";');

    this.addSql('alter table "team_event" rename column "location" to "place";');

    this.addSql('alter table "team_event_registration" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_status_check" check ("status" in (\'sure\', \'maybe\', \'notsure\'));');
  }

}
