import { Migration } from '@mikro-orm/migrations';

export class Migration20220711181141 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "announcement" ("announcement_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "short_description" text not null, "long_description" text null, "created_by_id" varchar(255) not null, "state" text check ("state" in (\'draft\', \'committed\', \'hidden\')) not null default \'draft\', "display_from" timestamptz(0) not null, "display_until" timestamptz(0) not null, "priority" int2 not null);');
    this.addSql('alter table "announcement" add constraint "announcement_created_by_id_foreign" foreign key ("created_by_id") references "user" ("user_id") on update cascade;');
  }

}
