import { Migration } from '@mikro-orm/migrations';

export class Migration20220905041453 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_labels" drop constraint "team_labels_team_label_slug_foreign";');

    this.addSql('alter table "team_label" drop constraint "team_label_pkey";');
    this.addSql('alter table "team_label" rename column "slug" to "id";');
    this.addSql('alter table "team_label" add constraint "team_label_pkey" primary key ("id");');

    this.addSql('alter table "team_labels" drop constraint "team_labels_pkey";');
    this.addSql('alter table "team_labels" rename column "team_label_slug" to "team_label_id";');
    this.addSql('alter table "team_labels" add constraint "team_labels_team_label_id_foreign" foreign key ("team_label_id") references "team_label" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_labels" add constraint "team_labels_pkey" primary key ("team_id", "team_label_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_labels" drop constraint "team_labels_team_label_id_foreign";');

    this.addSql('alter table "team_label" drop constraint "team_label_pkey";');
    this.addSql('alter table "team_label" rename column "id" to "slug";');
    this.addSql('alter table "team_label" add constraint "team_label_pkey" primary key ("slug");');

    this.addSql('alter table "team_labels" drop constraint "team_labels_pkey";');
    this.addSql('alter table "team_labels" rename column "team_label_id" to "team_label_slug";');
    this.addSql('alter table "team_labels" add constraint "team_labels_team_label_slug_foreign" foreign key ("team_label_slug") references "team_label" ("slug") on update cascade on delete cascade;');
    this.addSql('alter table "team_labels" add constraint "team_labels_pkey" primary key ("team_id", "team_label_slug");');
  }

}
