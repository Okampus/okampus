import { Migration } from '@mikro-orm/migrations';

export class Migration20230826024418 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "location" add column "link" text not null default \'\', add column "details" text not null default \'\', add column "name" text not null default \'\';');
    this.addSql('alter table "location" drop column "online_link";');
    this.addSql('alter table "location" drop column "location_details";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "location" add column "online_link" text not null default \'\', add column "location_details" text not null default \'\';');
    this.addSql('alter table "location" drop column "link";');
    this.addSql('alter table "location" drop column "details";');
    this.addSql('alter table "location" drop column "name";');
  }

}
