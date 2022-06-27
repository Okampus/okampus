import { Migration } from '@mikro-orm/migrations';

export class Migration20220611202634 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team_metric" ("team_metric_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "day_values" text[] not null, "name" text check ("name" in (\'clubCount\', \'membershipCount\', \'uniqueMembershipCount\', \'eventCount\', \'createdEventCount\')) not null);');
  }

}
