import { Migration } from '@mikro-orm/migrations';

export class Migration20220704174747 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" add column "membership_request_form_id" int4 null;');
    this.addSql('alter table "team" add constraint "team_membership_request_form_id_unique" unique ("membership_request_form_id");');
    this.addSql('alter table "team" add constraint "team_membership_request_form_id_foreign" foreign key ("membership_request_form_id") references "team_form" ("team_form_id") on update cascade on delete set null;');
  }

}
