import { Migration } from '@mikro-orm/migrations';

export class Migration20220907041910 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "interest" alter column "message" type varchar(255) using ("message"::varchar(255));');
    this.addSql('alter table "interest" alter column "message" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "interest" alter column "message" type varchar(255) using ("message"::varchar(255));');
    this.addSql('alter table "interest" alter column "message" set not null;');
  }

}
