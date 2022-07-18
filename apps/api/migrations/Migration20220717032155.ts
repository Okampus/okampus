import { Migration } from '@mikro-orm/migrations';

export class Migration20220717032155 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "vote" drop constraint if exists "vote_content_master_id_check";');
    this.addSql('alter table "vote" alter column "content_master_id" type int4 using ("content_master_id"::int4);');

    this.addSql('alter table "report" drop constraint if exists "report_content_master_id_check";');
    this.addSql('alter table "report" alter column "content_master_id" type int4 using ("content_master_id"::int4);');

    this.addSql('alter table "reaction" drop constraint if exists "reaction_content_master_id_check";');
    this.addSql('alter table "reaction" alter column "content_master_id" type int4 using ("content_master_id"::int4);');

    this.addSql('alter table "favorite" drop constraint if exists "favorite_content_master_id_check";');
    this.addSql('alter table "favorite" alter column "content_master_id" type int4 using ("content_master_id"::int4);');

    this.addSql('drop index "report_reporter_id_index";');
  }

}
