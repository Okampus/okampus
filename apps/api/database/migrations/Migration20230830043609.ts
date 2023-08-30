import { Migration } from '@mikro-orm/migrations';

export class Migration20230830043609 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" drop constraint if exists "team_type_check";');

    this.addSql('alter table "team" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team" add constraint "team_type_check" check ("type" in (\'AdminTeam\', \'Association\', \'Club\', \'Project\', \'Department\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team" drop constraint if exists "team_type_check";');

    this.addSql('alter table "team" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team" add constraint "team_type_check" check ("type" in (\'Association\', \'Canteen\', \'Company\', \'Club\', \'Project\', \'Department\', \'Tenant\'));');
  }

}
