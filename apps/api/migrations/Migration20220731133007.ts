import { Migration } from '@mikro-orm/migrations';

export class Migration20220731133007 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" drop column "membership_request_link";');
    this.addSql('alter table "team" drop column "membership_request_message";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team" add column "membership_request_link" text null, add column "membership_request_message" text null;');
  }

}
