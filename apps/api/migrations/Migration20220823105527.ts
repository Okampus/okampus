import { Migration } from '@mikro-orm/migrations';

export class Migration20220823105527 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_file" add column "special_type" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_file" drop column "special_type";');
  }

}
