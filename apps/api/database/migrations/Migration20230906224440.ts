import { Migration } from '@mikro-orm/migrations';

export class Migration20230906224440 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "event_approval_step_validators" cascade;');

    this.addSql('drop table if exists "event_approval_step_notifiees" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "event_approval_step_validators" ("event_approval_step_id" bigint not null, "user_id" bigint not null, constraint "event_approval_step_validators_pkey" primary key ("event_approval_step_id", "user_id"));');

    this.addSql('create table "event_approval_step_notifiees" ("event_approval_step_id" bigint not null, "user_id" bigint not null, constraint "event_approval_step_notifiees_pkey" primary key ("event_approval_step_id", "user_id"));');

    this.addSql('alter table "event_approval_step_validators" add constraint "event_approval_step_validators_event_approval_step_id_foreign" foreign key ("event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval_step_validators" add constraint "event_approval_step_validators_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event_approval_step_notifiees" add constraint "event_approval_step_notifiees_event_approval_step_id_foreign" foreign key ("event_approval_step_id") references "event_approval_step" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval_step_notifiees" add constraint "event_approval_step_notifiees_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
  }

}
