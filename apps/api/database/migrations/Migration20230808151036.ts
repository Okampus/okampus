import { Migration } from '@mikro-orm/migrations';

export class Migration20230808151036 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "form_submission_linked_files" ("form_submission_id" bigint not null, "file_upload_id" bigint not null, constraint "form_submission_linked_files_pkey" primary key ("form_submission_id", "file_upload_id"));');

    this.addSql('alter table "form_submission_linked_files" add constraint "form_submission_linked_files_form_submission_id_foreign" foreign key ("form_submission_id") references "form_submission" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "form_submission_linked_files" add constraint "form_submission_linked_files_file_upload_id_foreign" foreign key ("file_upload_id") references "file_upload" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "form" rename column "is_required" to "is_locked";');

    this.addSql('alter table "role" rename column "is_required" to "is_locked";');

    this.addSql('alter table "pole" rename column "is_required" to "is_locked";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "form_submission_linked_files" cascade;');

    this.addSql('alter table "form" rename column "is_locked" to "is_required";');

    this.addSql('alter table "role" rename column "is_locked" to "is_required";');

    this.addSql('alter table "pole" rename column "is_locked" to "is_required";');
  }

}
