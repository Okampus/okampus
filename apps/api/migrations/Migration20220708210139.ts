import { Migration } from '@mikro-orm/migrations';

export class Migration20220708210139 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "report" drop constraint "report_content_id_unique";');
  }

}
