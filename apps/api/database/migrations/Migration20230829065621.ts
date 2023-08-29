import { Migration } from '@mikro-orm/migrations';

export class Migration20230829065621 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "finance_tags" cascade;');

    this.addSql('alter table "tag" drop constraint if exists "tag_type_check";');

    this.addSql('alter table "tag" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "tag" add constraint "tag_type_check" check ("type" in (\'TeamCategory\', \'ClassGroup\', \'Cohort\', \'Tag\'));');
  }

  async down(): Promise<void> {
    this.addSql('create table "finance_tags" ("finance_id" bigint not null, "tag_id" bigint not null, constraint "finance_tags_pkey" primary key ("finance_id", "tag_id"));');

    this.addSql('alter table "finance_tags" add constraint "finance_tags_finance_id_foreign" foreign key ("finance_id") references "finance" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "finance_tags" add constraint "finance_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "tag" drop constraint if exists "tag_type_check";');

    this.addSql('alter table "tag" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "tag" add constraint "tag_type_check" check ("type" in (\'TeamCategory\', \'Finance\', \'Tag\'));');
  }

}
