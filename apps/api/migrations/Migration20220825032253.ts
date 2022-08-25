import { Migration } from '@mikro-orm/migrations';

export class Migration20220825032253 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event" drop constraint "team_event_last_validation_step_id_unique";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_event" add constraint "team_event_last_validation_step_id_unique" unique ("last_validation_step_id");');
  }

}
