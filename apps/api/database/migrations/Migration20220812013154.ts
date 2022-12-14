import { Migration } from '@mikro-orm/migrations';

export class Migration20220812013154 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "profile_image" add column "tenant_id" varchar(255) null, add column "active" boolean not null, add column "type" varchar(255) not null;');
    this.addSql('alter table "profile_image" add constraint "profile_image_tenant_id_foreign" foreign key ("tenant_id") references "tenant" ("id") on update cascade on delete CASCADE;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "profile_image" drop constraint "profile_image_tenant_id_foreign";');

    this.addSql('alter table "profile_image" drop column "tenant_id";');
    this.addSql('alter table "profile_image" drop column "active";');
    this.addSql('alter table "profile_image" drop column "type";');
  }

}
