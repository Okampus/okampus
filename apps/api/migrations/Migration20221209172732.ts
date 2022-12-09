import { Migration } from '@mikro-orm/migrations';

export class Migration20221209172732 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_member" add column "activity_count" int not null, add column "activity_score" int not null;');
    this.addSql('alter table "team_member" drop column "participations";');
    this.addSql('alter table "team_member" drop column "participation_score";');

    this.addSql('alter table "event_registration" rename column "participation_score" to "activity_score";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_member" add column "participations" int not null, add column "participation_score" int not null;');
    this.addSql('alter table "team_member" drop column "activity_count";');
    this.addSql('alter table "team_member" drop column "activity_score";');

    this.addSql('alter table "event_registration" rename column "activity_score" to "participation_score";');
  }

}
