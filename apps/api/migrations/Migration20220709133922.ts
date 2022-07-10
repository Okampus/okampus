import { Migration } from '@mikro-orm/migrations';

export class Migration20220709133922 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event" drop column "meeting_point";');
    this.addSql('alter table "team_event" drop column "preconditions";');
    this.addSql('alter table "team_event" drop column "question_fallback";');
    this.addSql('alter table "team_event" drop column "link";');

    this.addSql('alter table "team_event" drop constraint if exists "team_event_state_check";');
    this.addSql('alter table "team_event" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "team_event" add constraint "team_event_state_check" check ("state" in (\'template\', \'draft\', \'published\', \'approved\', \'rejected\'));');
  }

}
