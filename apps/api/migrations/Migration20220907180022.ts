import { Migration } from '@mikro-orm/migrations';

export class Migration20220907180022 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "finished_introduction" boolean not null default false;');
    this.addSql('alter table "user" alter column "finished_onboarding" type boolean using ("finished_onboarding"::boolean);');
    this.addSql('alter table "user" alter column "finished_onboarding" set default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" alter column "finished_onboarding" drop default;');
    this.addSql('alter table "user" alter column "finished_onboarding" type boolean using ("finished_onboarding"::boolean);');
    this.addSql('alter table "user" drop column "finished_introduction";');
  }

}
