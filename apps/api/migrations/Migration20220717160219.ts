import { Migration } from '@mikro-orm/migrations';

export class Migration20220717160219 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "content_master" add column "op_validation_id" int4 null;');
    this.addSql('alter table "content_master" add constraint "content_master_op_validation_id_unique" unique ("op_validation_id");');
    this.addSql('alter table "content_master" drop constraint "content_master_op_validated_with_id_foreign";');
    this.addSql('alter table "content_master" drop constraint "content_master_op_validated_with_id_unique";');
    this.addSql('alter table "content_master" drop column "op_validated_with_id";');
    this.addSql('alter table "content_master" drop constraint "content_master_admin_validated_with_id_foreign";');
    this.addSql('alter table "content_master" drop constraint "content_master_admin_validated_with_id_unique";');
    this.addSql('alter table "content_master" drop column "admin_validated_with_id";');
    this.addSql('alter table "content_master" drop constraint "content_master_admin_validated_by_id_foreign";');
    this.addSql('alter table "content_master" drop column "admin_validated_by_id";');

    this.addSql('alter table "vote" drop constraint if exists "vote_content_master_id_check";');
    this.addSql('alter table "vote" alter column "content_master_id" type int4 using ("content_master_id"::int4);');

    this.addSql('create table "validation" ("validation_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content_master_id" int4 not null, "user_id" varchar(255) not null, "content_id" int4 not null, "active" bool not null default true);');
    this.addSql('create index "validation_user_id_index" on "validation" ("user_id");');
    this.addSql('create index "validation_content_id_index" on "validation" ("content_id");');

    this.addSql('alter table "report" drop constraint if exists "report_content_master_id_check";');
    this.addSql('alter table "report" alter column "content_master_id" type int4 using ("content_master_id"::int4);');

    this.addSql('alter table "reaction" drop constraint if exists "reaction_content_master_id_check";');
    this.addSql('alter table "reaction" alter column "content_master_id" type int4 using ("content_master_id"::int4);');

    this.addSql('alter table "favorite" drop constraint if exists "favorite_content_master_id_check";');
    this.addSql('alter table "favorite" alter column "content_master_id" type int4 using ("content_master_id"::int4);');

    this.addSql('alter table "content_master" add constraint "content_master_op_validation_id_foreign" foreign key ("op_validation_id") references "validation" ("validation_id") on update cascade on delete set null;');

    this.addSql('alter table "validation" add constraint "validation_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("content_master_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "validation" add constraint "validation_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "validation" add constraint "validation_content_id_foreign" foreign key ("content_id") references "content" ("content_id") on update cascade on delete CASCADE;');
  }

}
