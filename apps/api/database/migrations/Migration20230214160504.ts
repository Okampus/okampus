import { Migration } from '@mikro-orm/migrations';

export class Migration20230214160504 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "interaction" alter column "type" type varchar(255) using ("type"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "interaction" alter column "type" type jsonb using ("type"::jsonb);');
  }

}
