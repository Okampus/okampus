import { Migration } from '@mikro-orm/migrations';

export class Migration20230906032158 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_join" drop constraint "team_join_asked_role_id_foreign";');

    this.addSql('alter table "team_join" drop column "asked_role_id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_join" add column "asked_role_id" bigint not null;');
    this.addSql('alter table "team_join" add constraint "team_join_asked_role_id_foreign" foreign key ("asked_role_id") references "team_role" ("id") on update cascade;');
  }

}
