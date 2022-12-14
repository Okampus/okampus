import { Migration } from '@mikro-orm/migrations';

export class Migration20221123195245 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "subject" drop constraint "subject_school_group_id_foreign";');

    this.addSql('alter table "info_doc" drop constraint "info_doc_school_group_id_foreign";');

    this.addSql('alter table "class_membership" drop constraint "class_membership_school_group_id_foreign";');

    this.addSql('alter table "subject" rename column "school_group_id" to "school_class_id";');
    this.addSql('alter table "subject" add constraint "subject_school_class_id_foreign" foreign key ("school_class_id") references "class" ("id") on update cascade;');

    this.addSql('alter table "info_doc" rename column "school_group_id" to "school_class_id";');
    this.addSql('alter table "info_doc" add constraint "info_doc_school_class_id_foreign" foreign key ("school_class_id") references "class" ("id") on update cascade;');

    this.addSql('drop index "class_membership_school_group_id_index";');
    this.addSql('alter table "class_membership" rename column "school_group_id" to "school_class_id";');
    this.addSql('alter table "class_membership" add constraint "class_membership_school_class_id_foreign" foreign key ("school_class_id") references "class" ("id") on update cascade on delete CASCADE;');
    this.addSql('create index "class_membership_school_class_id_index" on "class_membership" ("school_class_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "subject" drop constraint "subject_school_class_id_foreign";');

    this.addSql('alter table "info_doc" drop constraint "info_doc_school_class_id_foreign";');

    this.addSql('alter table "class_membership" drop constraint "class_membership_school_class_id_foreign";');

    this.addSql('alter table "subject" rename column "school_class_id" to "school_group_id";');
    this.addSql('alter table "subject" add constraint "subject_school_group_id_foreign" foreign key ("school_group_id") references "class" ("id") on update cascade;');

    this.addSql('alter table "info_doc" rename column "school_class_id" to "school_group_id";');
    this.addSql('alter table "info_doc" add constraint "info_doc_school_group_id_foreign" foreign key ("school_group_id") references "class" ("id") on update cascade;');

    this.addSql('drop index "class_membership_school_class_id_index";');
    this.addSql('alter table "class_membership" rename column "school_class_id" to "school_group_id";');
    this.addSql('alter table "class_membership" add constraint "class_membership_school_group_id_foreign" foreign key ("school_group_id") references "class" ("id") on update cascade on delete CASCADE;');
    this.addSql('create index "class_membership_school_group_id_index" on "class_membership" ("school_group_id");');
  }

}
