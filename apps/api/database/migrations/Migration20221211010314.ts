import { Migration } from '@mikro-orm/migrations';

export class Migration20221211010314 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" drop constraint if exists "event_state_check";');

    this.addSql('alter table "event" drop constraint "event_registration_form_id_foreign";');
    this.addSql('alter table "event" drop constraint "event_used_template_id_foreign";');

    this.addSql('alter table "event" add column "tenant_slug" varchar(255) not null, add column "register_form_id" int null, add column "template_id" int null;');
    this.addSql('alter table "event" alter column "price" type int using ("price"::int);');
    this.addSql('alter table "event" alter column "price" set default 0;');
    this.addSql('alter table "event" alter column "private" type boolean using ("private"::boolean);');
    this.addSql('alter table "event" alter column "private" set default false;');
    this.addSql('alter table "event" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "event" add constraint "event_state_check" check ("state" in (\'Template\', \'Draft\', \'Submitted\', \'Rejected\', \'Published\'));');
    this.addSql('alter table "event" alter column "state" set default \'Submitted\';');
    this.addSql('alter table "event" drop constraint "event_registration_form_id_unique";');
    this.addSql('alter table "event" add constraint "event_tenant_slug_foreign" foreign key ("tenant_slug") references "tenant" ("slug") on update cascade;');
    this.addSql('alter table "event" add constraint "event_register_form_id_foreign" foreign key ("register_form_id") references "team_form" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event" add constraint "event_template_id_foreign" foreign key ("template_id") references "event" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" drop column "registration_form_id";');
    this.addSql('alter table "event" drop column "used_template_id";');
    this.addSql('alter table "event" add constraint "event_register_form_id_unique" unique ("register_form_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop constraint if exists "event_state_check";');

    this.addSql('alter table "event" drop constraint "event_tenant_slug_foreign";');
    this.addSql('alter table "event" drop constraint "event_register_form_id_foreign";');
    this.addSql('alter table "event" drop constraint "event_template_id_foreign";');

    this.addSql('alter table "event" add column "registration_form_id" int null, add column "used_template_id" int null;');
    this.addSql('alter table "event" alter column "price" drop default;');
    this.addSql('alter table "event" alter column "price" type int using ("price"::int);');
    this.addSql('alter table "event" alter column "state" drop default;');
    this.addSql('alter table "event" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "event" add constraint "event_state_check" check ("state" in (\'Template\', \'Draft\', \'Submitted\', \'Rejected\', \'Published\'));');
    this.addSql('alter table "event" alter column "private" drop default;');
    this.addSql('alter table "event" alter column "private" type boolean using ("private"::boolean);');
    this.addSql('alter table "event" drop constraint "event_register_form_id_unique";');
    this.addSql('alter table "event" add constraint "event_registration_form_id_foreign" foreign key ("registration_form_id") references "team_form" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "event" add constraint "event_used_template_id_foreign" foreign key ("used_template_id") references "event" ("id") on update cascade on delete set null;');
    this.addSql('alter table "event" drop column "tenant_slug";');
    this.addSql('alter table "event" drop column "register_form_id";');
    this.addSql('alter table "event" drop column "template_id";');
    this.addSql('alter table "event" add constraint "event_registration_form_id_unique" unique ("registration_form_id");');
  }

}
