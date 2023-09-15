import { Migration } from '@mikro-orm/migrations';

export class Migration20230913012947 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" drop constraint if exists "team_type_check";');

    this.addSql('alter table "required_role" alter column "team_types" type text[] using ("team_types"::text[]);');

    this.addSql('alter table "required_document" alter column "team_types" type text[] using ("team_types"::text[]);');

    this.addSql('alter table "team" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team" add constraint "team_type_check" check ("type" in (\'Association\', \'Club\', \'Project\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team" drop constraint if exists "team_type_check";');

    this.addSql('alter table "required_role" alter column "team_types" type text[] using ("team_types"::text[]);');

    this.addSql('alter table "required_document" alter column "team_types" type text[] using ("team_types"::text[]);');

    this.addSql('alter table "team" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team" add constraint "team_type_check" check ("type" in (\'AdminTeam\', \'Association\', \'Club\', \'Project\'));');
  }

}
