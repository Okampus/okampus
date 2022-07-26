import { Migration } from '@mikro-orm/migrations';

export class Migration20220726133247 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "configuration" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "configuration" add constraint "configuration_pkey" primary key ("id");');

    this.addSql('create table "validation_step" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "configuration_id" varchar(255) not null, "step" int not null, "name" varchar(255) not null);');
    this.addSql('alter table "validation_step" add column "type" text check ("type" in (\'team-event\')) not null;');

    this.addSql('create table "validation_step_users" ("validation_step_id" int not null, "user_id" varchar(255) not null);');
    this.addSql('alter table "validation_step_users" add constraint "validation_step_users_pkey" primary key ("validation_step_id", "user_id");');

    this.addSql('alter table "validation_step" add constraint "validation_step_configuration_id_foreign" foreign key ("configuration_id") references "configuration" ("id") on update cascade;');

    this.addSql('alter table "validation_step_users" add constraint "validation_step_users_validation_step_id_foreign" foreign key ("validation_step_id") references "validation_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "validation_step_users" add constraint "validation_step_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "validation_step" drop constraint "validation_step_configuration_id_foreign";');

    this.addSql('alter table "validation_step_users" drop constraint "validation_step_users_validation_step_id_foreign";');

    this.addSql('drop table if exists "configuration" cascade;');

    this.addSql('drop table if exists "validation_step" cascade;');

    this.addSql('drop table if exists "validation_step_users" cascade;');

    this.addSql('alter table "validation" alter column "active" type boolean using ("active"::boolean);');
    this.addSql('alter table "validation" alter column "active" set default true;');
  }

}
