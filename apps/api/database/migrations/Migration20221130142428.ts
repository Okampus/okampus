import { Migration } from '@mikro-orm/migrations';

export class Migration20221130142428 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event_approval" drop constraint "event_approval_event_id_foreign";');
    this.addSql('alter table "event_approval" drop constraint "event_approval_step_id_foreign";');

    this.addSql('alter table "event_approval" add column "reason" text null;');
    this.addSql('alter table "event_approval" alter column "event_id" type int using ("event_id"::int);');
    this.addSql('alter table "event_approval" alter column "event_id" drop not null;');
    this.addSql('alter table "event_approval" alter column "step_id" type int using ("step_id"::int);');
    this.addSql('alter table "event_approval" alter column "step_id" drop not null;');
    this.addSql('alter table "event_approval" add constraint "event_approval_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event_approval" add constraint "event_approval_step_id_foreign" foreign key ("step_id") references "approval_step" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event_approval" drop constraint "event_approval_event_id_foreign";');
    this.addSql('alter table "event_approval" drop constraint "event_approval_step_id_foreign";');

    this.addSql('alter table "event_approval" alter column "event_id" type int using ("event_id"::int);');
    this.addSql('alter table "event_approval" alter column "event_id" set not null;');
    this.addSql('alter table "event_approval" alter column "step_id" type int using ("step_id"::int);');
    this.addSql('alter table "event_approval" alter column "step_id" set not null;');
    this.addSql('alter table "event_approval" drop column "reason";');
    this.addSql('alter table "event_approval" add constraint "event_approval_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;');
    this.addSql('alter table "event_approval" add constraint "event_approval_step_id_foreign" foreign key ("step_id") references "approval_step" ("id") on update cascade;');
  }

}
