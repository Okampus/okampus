import { Migration } from '@mikro-orm/migrations';

export class Migration20220731180844 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_member" add column "participations" int not null, add column "participation_score" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_member" drop column "participations";');
    this.addSql('alter table "team_member" drop column "participation_score";');
  }

}
