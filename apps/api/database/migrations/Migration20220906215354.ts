import { Migration } from '@mikro-orm/migrations';

export class Migration20220906215354 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" add column "location" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team" drop column "location";');
  }

}
