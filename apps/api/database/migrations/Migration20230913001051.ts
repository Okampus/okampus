import { Migration } from '@mikro-orm/migrations';

export class Migration20230913001051 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "required_role" add column "is_required" boolean not null default false;');

    this.addSql('alter table "required_document" add column "is_required" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "required_role" drop column "is_required";');

    this.addSql('alter table "required_document" drop column "is_required";');
  }

}
