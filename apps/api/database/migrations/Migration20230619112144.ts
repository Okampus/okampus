import { Migration } from '@mikro-orm/migrations';

export class Migration20230619112144 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "legal_unit" drop constraint "legal_unit_actor_id_foreign";');

    this.addSql('alter table "legal_unit" drop column "actor_id";');

    this.addSql('alter table "actor" add column "legal_unit_id" bigint null;');
    this.addSql('alter table "actor" add constraint "actor_legal_unit_id_foreign" foreign key ("legal_unit_id") references "legal_unit" ("id") on update cascade on delete set null;');
    this.addSql('alter table "actor" add constraint "actor_legal_unit_id_unique" unique ("legal_unit_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "actor" drop constraint "actor_legal_unit_id_foreign";');

    this.addSql('alter table "actor" drop constraint "actor_legal_unit_id_unique";');
    this.addSql('alter table "actor" drop column "legal_unit_id";');

    this.addSql('alter table "legal_unit" add column "actor_id" bigint not null;');
    this.addSql('alter table "legal_unit" add constraint "legal_unit_actor_id_foreign" foreign key ("actor_id") references "actor" ("id") on update cascade on delete CASCADE;');
  }

}
