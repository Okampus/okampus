import { Migration } from '@mikro-orm/migrations';

export class Migration20220903011940 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team_label" ("slug" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "tooltip" varchar(255) not null, "type" varchar(255) not null, constraint "team_label_pkey" primary key ("slug"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "team_label" cascade;');
  }

}
