import { Migration } from '@mikro-orm/migrations';

export class Migration20220628165446 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_metric" add column "value" real not null;');
    this.addSql('alter table "team_metric" drop column "day_values";');
  }

}
