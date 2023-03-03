import { Migration } from '@mikro-orm/migrations';

export class Migration20230228230534 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "form_edit" drop constraint "form_edit_form_id_foreign";');

    this.addSql('alter table "form_edit" rename column "form_id" to "linked_form_id";');
    this.addSql('alter table "form_edit" add constraint "form_edit_linked_form_id_foreign" foreign key ("linked_form_id") references "ugc" ("id") on update cascade on delete CASCADE;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "form_edit" drop constraint "form_edit_linked_form_id_foreign";');

    this.addSql('alter table "form_edit" rename column "linked_form_id" to "form_id";');
    this.addSql('alter table "form_edit" add constraint "form_edit_form_id_foreign" foreign key ("form_id") references "ugc" ("id") on update cascade on delete CASCADE;');
  }

}
