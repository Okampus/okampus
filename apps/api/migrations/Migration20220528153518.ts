import { Migration } from '@mikro-orm/migrations';

export class Migration20220528153518 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_membership_request" add column "meta" jsonb null;');
  }

}
