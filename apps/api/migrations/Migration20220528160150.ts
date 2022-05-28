import { Migration } from '@mikro-orm/migrations';

export class Migration20220528160150 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_membership_request" rename column "message" to "handled_message";');


    this.addSql('alter table "team_membership_request" add column "meta" jsonb null;');
  }

}
