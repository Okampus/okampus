import { Migration } from '@mikro-orm/migrations';

export class Migration20220903020407 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team_labels" ("team_id" int not null, "team_label_slug" varchar(255) not null, constraint "team_labels_pkey" primary key ("team_id", "team_label_slug"));');

    this.addSql('alter table "team_labels" add constraint "team_labels_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_labels" add constraint "team_labels_team_label_slug_foreign" foreign key ("team_label_slug") references "team_label" ("slug") on update cascade on delete cascade;');

    this.addSql('alter table "team" drop column "tags";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "team_labels" cascade;');

    this.addSql('alter table "team" add column "tags" varchar(255) not null;');
  }

}
