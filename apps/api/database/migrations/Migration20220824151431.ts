import { Migration } from '@mikro-orm/migrations';

export class Migration20220824151431 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event" drop constraint if exists "team_event_state_check";');

    this.addSql('alter table "team_event" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "team_event" add constraint "team_event_state_check" check ("state" in (\'Template\', \'Draft\', \'Submitted\', \'Rejected\', \'Published\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_event" drop constraint if exists "team_event_state_check";');

    this.addSql('alter table "team_event" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "team_event" add constraint "team_event_state_check" check ("state" in (\'template\', \'draft\', \'submitted\', \'rejected\', \'published\'));');
  }

}
