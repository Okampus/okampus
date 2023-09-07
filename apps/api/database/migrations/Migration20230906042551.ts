import { Migration } from '@mikro-orm/migrations';

export class Migration20230906042551 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "legal_unit" drop column "website";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "legal_unit" add column "website" text null default null;');
  }

}
