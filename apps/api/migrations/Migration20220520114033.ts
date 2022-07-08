import { Migration } from '@mikro-orm/migrations';

export class Migration20220520114033 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" add column "long_description" text null, add column "category" text not null default \'\', add column "tags" text[] not null default \'[]\'::text[];');
  }

}
