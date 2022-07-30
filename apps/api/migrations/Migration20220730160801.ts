import { Migration } from '@mikro-orm/migrations';

export class Migration20220730160801 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_finance" rename column "mean" to "means";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_finance" rename column "means" to "mean";');
  }

}
