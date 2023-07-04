import { Migration } from '@mikro-orm/migrations';

export class Migration20230704172544 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "individual" drop constraint "individual_user_id_foreign";');
    this.addSql('alter table "individual" drop constraint "individual_bot_id_foreign";');

    this.addSql('alter table "individual" drop constraint "individual_user_id_unique";');
    this.addSql('alter table "individual" drop constraint "individual_bot_id_unique";');
    this.addSql('alter table "individual" drop column "user_id";');
    this.addSql('alter table "individual" drop column "bot_id";');

    this.addSql('alter table "bot" add column "individual_id" bigint not null;');
    this.addSql('alter table "bot" add constraint "bot_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "bot" add constraint "bot_individual_id_unique" unique ("individual_id");');

    this.addSql('alter table "user" add column "individual_id" bigint not null;');
    this.addSql('alter table "user" add constraint "user_individual_id_foreign" foreign key ("individual_id") references "individual" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_individual_id_unique" unique ("individual_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_individual_id_foreign";');

    this.addSql('alter table "bot" drop constraint "bot_individual_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_individual_id_unique";');
    this.addSql('alter table "user" drop column "individual_id";');

    this.addSql('alter table "individual" add column "user_id" bigint null default null, add column "bot_id" bigint null default null;');
    this.addSql('alter table "individual" add constraint "individual_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "individual" add constraint "individual_bot_id_foreign" foreign key ("bot_id") references "bot" ("id") on update cascade on delete set null;');
    this.addSql('alter table "individual" add constraint "individual_user_id_unique" unique ("user_id");');
    this.addSql('alter table "individual" add constraint "individual_bot_id_unique" unique ("bot_id");');

    this.addSql('alter table "bot" drop constraint "bot_individual_id_unique";');
    this.addSql('alter table "bot" drop column "individual_id";');
  }

}
