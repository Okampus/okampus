import { Migration } from '@mikro-orm/migrations';

export class Migration20220823110415 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_file" alter column "type" type varchar(255) using ("type"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_file" alter column "type" type text using ("type"::text);');
  }

}
