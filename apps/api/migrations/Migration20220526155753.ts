import { Migration } from '@mikro-orm/migrations';

export class Migration20220526155753 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "file_upload" drop constraint "file_upload_file_kind_check";');
    this.addSql('alter table "file_upload" add constraint "file_upload_file_kind_check" check ("file_kind" in (\'profile-image\', \'info-doc\', \'attachment\', \'study-doc\', \'team-file\'));');


    this.addSql('create table "team_file" ("team_file_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_id" varchar(255) not null, "team_id" int4 not null, "type" text check ("type" in (\'gallery\', \'document\')) not null, "description" text null);');
    this.addSql('alter table "team_file" add constraint "team_file_pkey" primary key ("team_file_id");');
    this.addSql('alter table "team_file" add constraint "team_file_file_id_unique" unique ("file_id");');

    this.addSql('alter table "team_file" add constraint "team_file_file_id_foreign" foreign key ("file_id") references "file_upload" ("file_upload_id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_file" add constraint "team_file_team_id_foreign" foreign key ("team_id") references "team" ("team_id") on update cascade;');

    this.addSql('drop table if exists "gallery_image" cascade;');
  }

}
