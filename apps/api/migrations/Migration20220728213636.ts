import { Migration } from '@mikro-orm/migrations';

export class Migration20220728213636 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "content_master_assigned_teams" ("content_master_id" int not null, "team_id" int not null);');
    this.addSql('alter table "content_master_assigned_teams" add constraint "content_master_assigned_teams_pkey" primary key ("content_master_id", "team_id");');

    this.addSql('create table "content_master_assigned_users" ("content_master_id" int not null, "user_id" varchar(255) not null);');
    this.addSql('alter table "content_master_assigned_users" add constraint "content_master_assigned_users_pkey" primary key ("content_master_id", "user_id");');

    this.addSql('alter table "content_master_assigned_teams" add constraint "content_master_assigned_teams_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_assigned_teams" add constraint "content_master_assigned_teams_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "content_master_assigned_users" add constraint "content_master_assigned_users_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_assigned_users" add constraint "content_master_assigned_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "content_master_assignees" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "content_master_assignees" ("content_master_id" int not null, "user_id" varchar(255) not null);');
    this.addSql('alter table "content_master_assignees" add constraint "content_master_assignees_pkey" primary key ("content_master_id", "user_id");');

    this.addSql('alter table "content_master_assignees" add constraint "content_master_assignees_content_master_id_foreign" foreign key ("content_master_id") references "content_master" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content_master_assignees" add constraint "content_master_assignees_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "content_master_assigned_teams" cascade;');

    this.addSql('drop table if exists "content_master_assigned_users" cascade;');
  }

}
