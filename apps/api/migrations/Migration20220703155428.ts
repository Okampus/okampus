import { Migration } from '@mikro-orm/migrations';

export class Migration20220703155428 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_metric" drop constraint if exists "team_metric_value_check";');
    this.addSql('alter table "team_metric" alter column "value" type real using ("value"::real);');

    this.addSql('alter table "team_event" add column "form_id" int4 null;');
    this.addSql('alter table "team_event" add constraint "team_event_form_id_unique" unique ("form_id");');

    this.addSql('alter table "team_event" add constraint "team_event_form_id_foreign" foreign key ("form_id") references "team_form" ("team_form_id") on update cascade on delete cascade;');
  }

}
