import { Migration } from '@mikro-orm/migrations';

export class Migration20220823112229 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_file" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_file" add constraint "team_file_type_check" check ("type" in (\'Constitution\', \'Rules\', \'Transcript\', \'LegalReceipt\', \'Brochure\', \'GraphicCharter\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_file" drop constraint if exists "team_file_type_check";');

    this.addSql('alter table "team_file" alter column "type" type varchar(255) using ("type"::varchar(255));');
  }

}
