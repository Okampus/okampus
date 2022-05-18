import { Migration } from '@mikro-orm/migrations';

export class Migration20220518185244 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_member" drop constraint if exists "team_member_role_check";');
    this.addSql('alter table "team_member" alter column "role" type text using ("role"::text);');
    this.addSql('alter table "team_member" add constraint "team_member_role_check" check ("role" in (\'owner\', \'coowner\', \'treasurer\', \'secretary\', \'manager\', \'member\'));');

    this.addSql('alter table "team_membership_request" add column "role" text check ("role" in (\'owner\', \'coowner\', \'treasurer\', \'secretary\', \'manager\', \'member\')) not null default \'member\';');
  }

}
