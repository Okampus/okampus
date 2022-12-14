import { Migration } from '@mikro-orm/migrations';

export class Migration20220824151851 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_form" drop constraint if exists "team_form_type_check";');

    this.addSql('alter table "team_form" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_form" add constraint "team_form_type_check" check ("type" in (\'MembershipRequest\', \'Internal\', \'EventRegistration\', \'Survey\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_form" drop constraint if exists "team_form_type_check";');

    this.addSql('alter table "team_form" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_form" add constraint "team_form_type_check" check ("type" in (\'MembershipRequest\', \'Internal\', \'Survey\'));');
  }

}
