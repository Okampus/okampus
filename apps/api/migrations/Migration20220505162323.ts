import { Migration } from '@mikro-orm/migrations';

export class Migration20220505162323 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "file_upload" drop constraint "file_upload_file_kind_check";');
    this.addSql('alter table "file_upload" add constraint "file_upload_file_kind_check" check ("file_kind" in (\'profile-image\', \'info-doc\', \'attachment\', \'study-doc\', \'gallery-image\'));');

    this.addSql('create table "gallery_image" ("gallery_image_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "team_id" int4 not null, "caption" text null);');
    this.addSql('alter table "gallery_image" add constraint "gallery_image_pkey" primary key ("gallery_image_id");');
    this.addSql('alter table "gallery_image" add constraint "gallery_image_file_id_unique" unique ("file_id");');

    this.addSql('alter table "gallery_image" add constraint "gallery_image_file_id_foreign" foreign key ("file_id") references "file_upload" ("file_upload_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "gallery_image" add constraint "gallery_image_team_id_foreign" foreign key ("team_id") references "team" ("team_id") on update cascade;');
  }

}
