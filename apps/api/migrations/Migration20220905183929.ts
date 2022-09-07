import { Migration } from '@mikro-orm/migrations';

export class Migration20220905183929 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "file_upload" add column "width" int null, add column "height" int null;');

    this.addSql('alter table "team_gallery" drop column "width";');
    this.addSql('alter table "team_gallery" drop column "height";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "file_upload" drop column "width";');
    this.addSql('alter table "file_upload" drop column "height";');

    this.addSql('alter table "team_gallery" add column "width" int4 not null default null, add column "height" int4 not null default null;');
  }

}
