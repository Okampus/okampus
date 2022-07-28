import { Migration } from '@mikro-orm/migrations';

export class Migration20220728223525 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "school_group" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql('alter table "school_group" alter column "parent_id" type varchar(255) using ("parent_id"::varchar(255));');
    this.addSql('drop index "school_group_code_index";');
    this.addSql('alter table "school_group" drop constraint "school_group_code_unique";');
    this.addSql('alter table "school_group" drop column "code";');
    this.addSql('alter table "school_group" alter column "id" drop default;');

    this.addSql('alter table "subject" alter column "school_group_id" type varchar(255) using ("school_group_id"::varchar(255));');

    this.addSql('alter table "info_doc" alter column "school_group_id" type varchar(255) using ("school_group_id"::varchar(255));');

    this.addSql('alter table "school_group_membership" alter column "school_group_id" type varchar(255) using ("school_group_id"::varchar(255));');

    this.addSql('alter table "content_master" add column "scope_id" varchar(255) null;');
    this.addSql('alter table "content_master" add constraint "content_master_scope_id_foreign" foreign key ("scope_id") references "school_group" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "content_master" drop constraint "content_master_scope_id_foreign";');

    this.addSql('alter table "content_master" drop column "scope_id";');

    this.addSql('alter table "school_group" add column "code" varchar(255) not null;');
    this.addSql('alter table "school_group" alter column "id" type int using ("id"::int);');
    this.addSql('alter table "school_group" alter column "parent_id" type int using ("parent_id"::int);');
    this.addSql('create sequence if not exists "school_group_id_seq";');
    this.addSql('select setval(\'school_group_id_seq\', (select max("id") from "school_group"));');
    this.addSql('alter table "school_group" alter column "id" set default nextval(\'school_group_id_seq\');');
    this.addSql('create index "school_group_code_index" on "school_group" ("code");');
    this.addSql('alter table "school_group" add constraint "school_group_code_unique" unique ("code");');

    this.addSql('alter table "subject" alter column "school_group_id" type int using ("school_group_id"::int);');

    this.addSql('alter table "info_doc" alter column "school_group_id" type int using ("school_group_id"::int);');

    this.addSql('alter table "school_group_membership" alter column "school_group_id" type int using ("school_group_id"::int);');
  }

}
