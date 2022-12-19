import { Migration } from '@mikro-orm/migrations';

export class Migration20221219050630 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_last_approval_step_id_foreign";');

    this.addSql('alter table "event" add constraint "event_last_approval_step_id_foreign" foreign key ("last_approval_step_id") references "approval_step" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_last_approval_step_id_foreign";');

    this.addSql('alter table "event" add constraint "event_last_approval_step_id_foreign" foreign key ("last_approval_step_id") references "team_form" ("id") on update cascade on delete set null;');
  }

}
