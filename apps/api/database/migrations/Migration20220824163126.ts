import { Migration } from '@mikro-orm/migrations';

export class Migration20220824163126 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event" add column "event_validation_submission" jsonb not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_event" drop column "event_validation_submission";');
  }

}
