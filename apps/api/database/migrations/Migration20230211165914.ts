import { Migration } from '@mikro-orm/migrations';

export class Migration20230211165914 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_action" drop constraint "team_action_supervisor_id_foreign";');

    this.addSql('alter table "team_action" add column "state" text check ("state" in (\'Pending\', \'Approved\', \'Rejected\')) not null, add column "validated_by_id" bigint null;');
    this.addSql('alter table "team_action" add constraint "team_action_validated_by_id_foreign" foreign key ("validated_by_id") references "membership" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_action" drop column "supervisor_id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_action" drop constraint "team_action_validated_by_id_foreign";');

    this.addSql('alter table "team_action" add column "supervisor_id" bigint not null;');
    this.addSql('alter table "team_action" add constraint "team_action_supervisor_id_foreign" foreign key ("supervisor_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "team_action" drop column "state";');
    this.addSql('alter table "team_action" drop column "validated_by_id";');
  }

}
