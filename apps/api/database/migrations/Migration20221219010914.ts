import { Migration } from '@mikro-orm/migrations';

export class Migration20221219010914 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_finance" rename column "type" to "state";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_finance" rename column "state" to "type";');
  }

}
