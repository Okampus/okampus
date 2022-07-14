import { Migration } from '@mikro-orm/migrations';

export class Migration20220714115727 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "badge" rename column "serie" to "series";');
  }

}
