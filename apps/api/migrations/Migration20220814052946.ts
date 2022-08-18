import { Migration } from '@mikro-orm/migrations';

export class Migration20220814052946 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_form" add column "type" text check ("type" in (\'MembershipRequest\', \'Internal\', \'Survey\')) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_form" drop column "type";');
  }

}
