import { Migration } from '@mikro-orm/migrations';

export class Migration20220504215224 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" add column "membership_request_link" text null, add column "membership_request_message" text null;');
  }

}
