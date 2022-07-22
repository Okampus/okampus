import { Migration } from '@mikro-orm/migrations';

export class Migration20220722115238 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event_registration" add column "present" boolean not null, add column "participation_score" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_event_registration" drop column "present";');
    this.addSql('alter table "team_event_registration" drop column "participation_score";');
  }

}
