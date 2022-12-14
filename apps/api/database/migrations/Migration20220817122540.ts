import { Migration } from '@mikro-orm/migrations';

export class Migration20220817122540 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_form" rename column "form" to "schema";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_form" rename column "schema" to "form";');
  }

}
