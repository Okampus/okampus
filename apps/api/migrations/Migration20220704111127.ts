import { Migration } from '@mikro-orm/migrations';

export class Migration20220704111127 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event" drop constraint if exists "team_event_state_check";');
    this.addSql('alter table "team_event" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "team_event" add constraint "team_event_state_check" check ("state" in (\'template\', \'draft\', \'published\'));');

    this.addSql('alter table "team_event" add column "used_template_id" int4 null;');
    this.addSql('alter table "team_event" add constraint "team_event_used_template_id_foreign" foreign key ("used_template_id") references "team_event" ("team_event_id") on update cascade on delete set null;');
  }

}
