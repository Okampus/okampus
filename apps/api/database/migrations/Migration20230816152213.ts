import { Migration } from '@mikro-orm/migrations';

export class Migration20230816152213 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" drop constraint if exists "event_state_check";');

    this.addSql('alter table "team" add column "expecting_president_email" text null default null, add column "expecting_treasurer_email" text null default null, add column "expecting_secretary_email" text null default null, add column "is_onboarding_complete" boolean not null default true;');

    this.addSql('alter table "event" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "event" add constraint "event_state_check" check ("state" in (\'Template\', \'Draft\', \'Submitted\', \'Rejected\', \'Approved\', \'Published\', \'Canceled\', \'Completed\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop constraint if exists "event_state_check";');

    this.addSql('alter table "team" drop column "expecting_president_email";');
    this.addSql('alter table "team" drop column "expecting_treasurer_email";');
    this.addSql('alter table "team" drop column "expecting_secretary_email";');
    this.addSql('alter table "team" drop column "is_onboarding_complete";');

    this.addSql('alter table "event" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "event" add constraint "event_state_check" check ("state" in (\'Template\', \'Draft\', \'Submitted\', \'Rejected\', \'Approved\', \'Published\', \'Completed\'));');
  }

}
