import { Migration } from '@mikro-orm/migrations';

export class Migration20220717015045 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "content" rename column "upvotes" to "n_upvotes";');
    this.addSql('alter table "content" rename column "downvotes" to "n_downvotes";');
    this.addSql('alter table "content" rename column "votes" to "n_total_votes";');
    this.addSql('alter table "content" rename column "report_count" to "n_reports";');
    this.addSql('alter table "content" add column "n_favorites" int4 not null;');

    this.addSql('alter table "vote" add column "content_master_id" int4 not null;');
    this.addSql('alter table "report" rename column "reporter_id" to "target_id";');

    this.addSql('alter table "report" add column "content_master_id" int4 not null;');
    this.addSql('alter table "report" drop constraint if exists "report_content_id_check";');
    this.addSql('alter table "report" alter column "content_id" type int4 using ("content_id"::int4);');
    this.addSql('alter table "report" alter column "content_id" set not null;');

    this.addSql('alter table "reaction" add column "content_master_id" int4 not null;');
    this.addSql('alter table "reaction" drop constraint if exists "reaction_value_check";');
    this.addSql('alter table "reaction" alter column "value" type text using ("value"::text);');
    this.addSql('alter table "reaction" add constraint "reaction_value_check" check ("value" in (\'what\', \'interesting\', \'like\', \'notanissue\', \'bump\', \'laugh\', \'unsure\', \'partial\', \'perfect\'));');

    this.addSql('alter table "favorite" add column "content_master_id" int4 not null, add column "active" bool not null default true;');

    this.addSql('alter table "announcement" drop constraint if exists "announcement_state_check";');
    this.addSql('alter table "announcement" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "announcement" add constraint "announcement_state_check" check ("state" in (\'draft\', \'committed\', \'hidden\'));');
    this.addSql('alter table "announcement" alter column "state" drop default;');

    this.addSql('alter table "favorite" drop constraint "favorite_content_id_unique";');
  }

}
