import { Migration } from '@mikro-orm/migrations';

export class Migration20230211202309 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "join" drop constraint "join_issuer_id_unique";');
    this.addSql('alter table "join" drop constraint "join_joiner_id_unique";');
    this.addSql('alter table "join" drop constraint "join_validated_by_id_unique";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "join" add constraint "join_issuer_id_unique" unique ("issuer_id");');
    this.addSql('alter table "join" add constraint "join_joiner_id_unique" unique ("joiner_id");');
    this.addSql('alter table "join" add constraint "join_validated_by_id_unique" unique ("validated_by_id");');
  }

}
