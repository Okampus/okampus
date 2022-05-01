import { Migration } from '@mikro-orm/migrations';

export class Migration20220501175812 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team_membership_request" ("team_membership_request_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "team_id" int4 not null, "user_id" varchar(255) not null, "message" text null, "issuer" text check ("issuer" in (\'team\', \'user\')) not null, "state" text check ("state" in (\'pending\', \'approved\', \'rejected\')) not null, "handled_by_id" varchar(255) null, "handled_at" timestamptz(0) null, "issued_by_id" varchar(255) not null);');
    this.addSql('create index "team_membership_request_team_id_index" on "team_membership_request" ("team_id");');
    this.addSql('create index "team_membership_request_user_id_index" on "team_membership_request" ("user_id");');

    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_team_id_foreign" foreign key ("team_id") references "team" ("team_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_user_id_foreign" foreign key ("user_id") references "user" ("user_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_handled_by_id_foreign" foreign key ("handled_by_id") references "user" ("user_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_membership_request" add constraint "team_membership_request_issued_by_id_foreign" foreign key ("issued_by_id") references "user" ("user_id") on update cascade on delete CASCADE;');
  }

}
