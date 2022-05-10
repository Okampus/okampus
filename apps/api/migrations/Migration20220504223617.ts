import { Migration } from '@mikro-orm/migrations';

export class Migration20220504223617 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "team_kind_index" on "team" ("kind");');

    this.addSql('create index "team_event_private_index" on "team_event" ("private");');

    this.addSql('create index "team_membership_request_state_index" on "team_membership_request" ("state");');
  }

}
