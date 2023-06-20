import { Migration } from '@mikro-orm/migrations';

export class Migration20230620161236 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "finance" add column "received_by_id" bigint not null;');
    this.addSql('alter table "finance" add constraint "finance_received_by_id_foreign" foreign key ("received_by_id") references "actor" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "finance" drop constraint "finance_received_by_id_foreign";');

    this.addSql('alter table "finance" drop column "received_by_id";');
  }

}
