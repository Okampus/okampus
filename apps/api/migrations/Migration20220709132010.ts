import { Migration } from '@mikro-orm/migrations';

export class Migration20220709132010 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "content_master" drop constraint if exists "content_master_title_check";');
    this.addSql('alter table "content_master" alter column "title" type text using ("title"::text);');
    this.addSql('alter table "content_master" alter column "title" set not null;');
  }

}
