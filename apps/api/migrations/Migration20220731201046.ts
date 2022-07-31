import { Migration } from '@mikro-orm/migrations';

export class Migration20220731201046 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" add column "active_member_count" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team" drop column "active_member_count";');
  }

}
