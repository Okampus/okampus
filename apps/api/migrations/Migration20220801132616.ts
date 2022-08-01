import { Migration } from '@mikro-orm/migrations';

export class Migration20220801132616 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event" drop constraint "team_event_form_id_foreign";');

    this.addSql('alter table "team_event" drop constraint "team_event_form_id_unique";');
    this.addSql('alter table "team_event" rename column "form_id" to "registration_form_id";');
    this.addSql('alter table "team_event" add constraint "team_event_registration_form_id_foreign" foreign key ("registration_form_id") references "team_form" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_event" add constraint "team_event_registration_form_id_unique" unique ("registration_form_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_event" drop constraint "team_event_registration_form_id_foreign";');

    this.addSql('alter table "team_event" drop constraint "team_event_registration_form_id_unique";');
    this.addSql('alter table "team_event" rename column "registration_form_id" to "form_id";');
    this.addSql('alter table "team_event" add constraint "team_event_form_id_foreign" foreign key ("form_id") references "team_form" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_event" add constraint "team_event_form_id_unique" unique ("form_id");');
  }

}
