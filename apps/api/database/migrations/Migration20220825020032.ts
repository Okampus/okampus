import { Migration } from '@mikro-orm/migrations';

export class Migration20220825020032 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event" add column "last_validation_step_id" int null;');
    this.addSql('alter table "team_event" add constraint "team_event_last_validation_step_id_foreign" foreign key ("last_validation_step_id") references "validation_step" ("id") on update cascade on delete set null;');
    this.addSql('alter table "team_event" drop column "validation_step";');
    this.addSql('alter table "team_event" add constraint "team_event_last_validation_step_id_unique" unique ("last_validation_step_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_event" drop constraint "team_event_last_validation_step_id_foreign";');

    this.addSql('alter table "team_event" add column "validation_step" int not null;');
    this.addSql('alter table "team_event" drop constraint "team_event_last_validation_step_id_unique";');
    this.addSql('alter table "team_event" drop column "last_validation_step_id";');
  }

}
