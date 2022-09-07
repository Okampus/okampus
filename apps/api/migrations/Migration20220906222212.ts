import { Migration } from '@mikro-orm/migrations';

export class Migration20220906222212 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "finished_onboarding" boolean not null;');

    this.addSql('alter table "interest" add constraint "interest_team_id_user_id_unique" unique ("team_id", "user_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "finished_onboarding";');

    this.addSql('alter table "interest" drop constraint "interest_team_id_user_id_unique";');
  }

}
