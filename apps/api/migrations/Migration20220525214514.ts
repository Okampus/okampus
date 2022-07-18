import { Migration } from '@mikro-orm/migrations';

export class Migration20220525214514 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" rename column "description" to "short_description";');

    this.addSql('alter table "team" drop constraint if exists "team_tags_check";');
    this.addSql('alter table "team" alter column "tags" type text[] using ("tags"::text[]);');

    this.addSql('alter table "user" rename column "description" to "short_description";');
  }

}
