import { Migration } from '@mikro-orm/migrations';

export class Migration20220731154435 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_membership_request" drop column "meta";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_membership_request" add column "meta" jsonb null;');
  }

}
