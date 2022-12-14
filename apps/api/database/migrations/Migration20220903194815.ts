import { Migration } from '@mikro-orm/migrations';

export class Migration20220903194815 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "interest" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "state" varchar(255) not null, "message" varchar(255) not null, "team_id" int not null, "user_id" varchar(255) not null);');

    this.addSql('alter table "interest" add constraint "interest_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "interest" add constraint "interest_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "interest" cascade;');
  }

}
