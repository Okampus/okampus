import { Migration } from '@mikro-orm/migrations';

export class Migration20220818203542 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "study_doc" drop constraint if exists "study_doc_type_check";');

    this.addSql('alter table "study_doc" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "study_doc" add constraint "study_doc_type_check" check ("type" in (\'examDE\', \'examCE\', \'examCC\', \'examDM\', \'examTAI\', \'course\', \'sheet\', \'projects\', \'schoolClass\', \'eprofClass\', \'classNote\', \'other\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "study_doc" drop constraint if exists "study_doc_type_check";');

    this.addSql('alter table "study_doc" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "study_doc" add constraint "study_doc_type_check" check ("type" in (\'examDE\', \'examCE\', \'examCC\', \'examDM\', \'examTAI\', \'course\', \'sheet\', \'projects\', \'efreiClass\', \'eprofClass\', \'classNote\', \'other\'));');
  }

}
