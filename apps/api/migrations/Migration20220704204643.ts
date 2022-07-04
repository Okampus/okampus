import { Migration } from '@mikro-orm/migrations';

export class Migration20220704204643 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_event_registration" add column "status" text check ("status" in (\'sure\', \'maybe\', \'notsure\')) not null;');
  }

}
