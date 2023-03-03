import { Migration } from '@mikro-orm/migrations';

export class Migration20230302124126 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "ugc" drop constraint if exists "ugc_type_check";');

    this.addSql('alter table "ugc" add column "undeletable" boolean null;');
    this.addSql('alter table "ugc" alter column "author_id" type bigint using ("author_id"::bigint);');
    this.addSql('alter table "ugc" alter column "author_id" drop not null;');
    this.addSql('alter table "ugc" alter column "real_author_id" type bigint using ("real_author_id"::bigint);');
    this.addSql('alter table "ugc" alter column "real_author_id" drop not null;');
    this.addSql('alter table "ugc" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "ugc" add constraint "ugc_type_check" check ("type" in (\'EventJoin\', \'TeamJoin\', \'Internal\', \'Survey\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "ugc" drop constraint if exists "ugc_type_check";');

    this.addSql('alter table "ugc" alter column "author_id" type bigint using ("author_id"::bigint);');
    this.addSql('alter table "ugc" alter column "author_id" set not null;');
    this.addSql('alter table "ugc" alter column "real_author_id" type bigint using ("real_author_id"::bigint);');
    this.addSql('alter table "ugc" alter column "real_author_id" set not null;');
    this.addSql('alter table "ugc" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "ugc" add constraint "ugc_type_check" check ("type" in (\'EventRegistration\', \'MembershipRequest\', \'Internal\', \'Survey\'));');
    this.addSql('alter table "ugc" drop column "undeletable";');
  }

}
