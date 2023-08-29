import { Migration } from '@mikro-orm/migrations';

export class Migration20230829180648 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "avatar" text not null default \'\', add column "banner" text not null default \'\';');

    this.addSql('alter table "team" add column "avatar" text not null default \'\', add column "banner" text not null default \'\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "avatar";');
    this.addSql('alter table "user" drop column "banner";');

    this.addSql('alter table "team" drop column "avatar";');
    this.addSql('alter table "team" drop column "banner";');
  }

}
