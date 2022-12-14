import { Migration } from '@mikro-orm/migrations';

export class Migration20220823165036 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tenant" add column "event_validation_form" jsonb null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tenant" drop column "event_validation_form";');
  }

}
