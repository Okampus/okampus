import { Migration } from '@mikro-orm/migrations';

export class Migration20221219051705 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_finance" alter column "amount" type real using ("amount"::real);');
    this.addSql('alter table "team_finance" alter column "amount_payed" type real using ("amount_payed"::real);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_finance" alter column "amount" type int using ("amount"::int);');
    this.addSql('alter table "team_finance" alter column "amount_payed" type int using ("amount_payed"::int);');
  }

}
