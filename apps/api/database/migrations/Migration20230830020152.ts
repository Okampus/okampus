import { Migration } from '@mikro-orm/migrations';

export class Migration20230830020152 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "actor_image" drop constraint if exists "actor_image_type_check";');

    this.addSql('alter table "actor" add column "avatar" text not null default \'\', add column "banner" text not null default \'\';');

    this.addSql('alter table "user" drop column "avatar";');
    this.addSql('alter table "user" drop column "banner";');

    this.addSql('alter table "team" drop column "avatar";');
    this.addSql('alter table "team" drop column "banner";');

    this.addSql('alter table "file_upload" add constraint "file_upload_url_unique" unique ("url");');

    this.addSql('alter table "actor_image" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "actor_image" add constraint "actor_image_type_check" check ("type" in (\'Avatar\', \'Banner\', \'Profile\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "actor_image" drop constraint if exists "actor_image_type_check";');

    this.addSql('alter table "actor" drop column "avatar";');
    this.addSql('alter table "actor" drop column "banner";');

    this.addSql('alter table "user" add column "avatar" text not null default \'\', add column "banner" text not null default \'\';');

    this.addSql('alter table "team" add column "avatar" text not null default \'\', add column "banner" text not null default \'\';');

    this.addSql('alter table "file_upload" drop constraint "file_upload_url_unique";');

    this.addSql('alter table "actor_image" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "actor_image" add constraint "actor_image_type_check" check ("type" in (\'Avatar\', \'AvatarDarkMode\', \'Banner\', \'Profile\'));');
  }

}
