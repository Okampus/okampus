import { Migration } from '@mikro-orm/migrations';

export class Migration20220905064424 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_label" add column "image" text null;');
    this.addSql('alter table "team_label" alter column "tooltip" type varchar(255) using ("tooltip"::varchar(255));');
    this.addSql('alter table "team_label" alter column "tooltip" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_label" alter column "tooltip" type varchar(255) using ("tooltip"::varchar(255));');
    this.addSql('alter table "team_label" alter column "tooltip" set not null;');
    this.addSql('alter table "team_label" drop column "image";');
  }

}
