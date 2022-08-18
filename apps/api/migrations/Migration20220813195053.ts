import { Migration } from '@mikro-orm/migrations';

export class Migration20220813195053 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team_receipt" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "last_active_date" timestamptz(0) null, "active" boolean not null, "file_id" varchar(255) not null, "team_id" int not null, "description" text null, "payed_at" timestamptz(0) not null, "payed_by_id" varchar(255) not null, "payment_location" text not null, constraint "team_receipt_pkey" primary key ("id"));');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_file_id_unique" unique ("file_id");');

    this.addSql('create table "team_gallery" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "last_active_date" timestamptz(0) null, "active" boolean not null, "file_id" varchar(255) not null, "team_id" int not null, "event_id" int null, "order" int not null, "width" int not null, "height" int not null, constraint "team_gallery_pkey" primary key ("id"));');
    this.addSql('alter table "team_gallery" add constraint "team_gallery_file_id_unique" unique ("file_id");');
    this.addSql('alter table "team_gallery" add constraint "team_gallery_event_id_unique" unique ("event_id");');

    this.addSql('alter table "team_receipt" add constraint "team_receipt_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "team_receipt" add constraint "team_receipt_payed_by_id_foreign" foreign key ("payed_by_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "team_gallery" add constraint "team_gallery_file_id_foreign" foreign key ("file_id") references "file_upload" ("id") on update cascade on delete CASCADE;');
    this.addSql('alter table "team_gallery" add constraint "team_gallery_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;');
    this.addSql('alter table "team_gallery" add constraint "team_gallery_event_id_foreign" foreign key ("event_id") references "team_event" ("id") on update cascade on delete set null;');

    this.addSql('alter table "file_upload" drop constraint if exists "file_upload_file_kind_check";');

    this.addSql('alter table "file_upload" alter column "file_kind" type text using ("file_kind"::text);');
    this.addSql('alter table "file_upload" add constraint "file_upload_file_kind_check" check ("file_kind" in (\'profile-image\', \'info-doc\', \'attachment\', \'study-doc\', \'team-file\', \'team-gallery\', \'team-receipt\', \'tenant\'));');

    this.addSql('alter table "content" add column "real_author_id" varchar(255) not null;');
    this.addSql('alter table "content" add constraint "content_real_author_id_foreign" foreign key ("real_author_id") references "user" ("id") on update cascade on delete CASCADE;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "team_receipt" cascade;');

    this.addSql('drop table if exists "team_gallery" cascade;');

    this.addSql('alter table "file_upload" drop constraint if exists "file_upload_file_kind_check";');

    this.addSql('alter table "content" drop constraint "content_real_author_id_foreign";');

    this.addSql('alter table "file_upload" alter column "file_kind" type text using ("file_kind"::text);');
    this.addSql('alter table "file_upload" add constraint "file_upload_file_kind_check" check ("file_kind" in (\'profile-image\', \'info-doc\', \'attachment\', \'study-doc\', \'team-file\', \'tenant\'));');

    this.addSql('alter table "content" drop column "real_author_id";');
  }

}
