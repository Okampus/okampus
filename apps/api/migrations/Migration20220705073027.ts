import { Migration } from '@mikro-orm/migrations';

export class Migration20220705073027 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event_registration" add column "original_form_id" int4 null, add column "form_submission" jsonb null;');
    this.addSql('alter table "team_event_registration" add constraint "team_event_registration_original_form_id_foreign" foreign key ("original_form_id") references "team_form" ("team_form_id") on update cascade on delete set null;');

    this.addSql('alter table "team_membership_request" add column "original_form_id" int4 null, add column "form_submission" jsonb null;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_original_form_id_foreign" foreign key ("original_form_id") references "team_form" ("team_form_id") on update cascade on delete set null;');
  }

}
