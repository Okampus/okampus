import { Migration } from '@mikro-orm/migrations';

export class Migration20230914054456 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "form" drop column "name";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "form" add column "name" text not null;');
  }

}
