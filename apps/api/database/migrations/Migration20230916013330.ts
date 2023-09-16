import { Migration } from '@mikro-orm/migrations';

export class Migration20230916013330 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_role" add column "can_manage_documents" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_role" drop column "can_manage_documents";');
  }

}
