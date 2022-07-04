import { Migration } from '@mikro-orm/migrations';

export class Migration20220704073750 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_metric" rename to "metric";');

    this.addSql('alter table "metric" rename constraint "team_metric_pkey" to "metric_pkey";');
    this.addSql('alter sequence "team_metric_team_metric_id_seq" rename to "metric_team_metric_id_seq";');

    this.addSql('alter table "metric" rename column "team_metric_id" to "metric_id";');

    this.addSql('alter table "metric" drop constraint if exists "team_metric_value_check";');
    this.addSql('alter table "metric" drop constraint if exists "metric_value_check";');
    this.addSql('alter table "metric" alter column "value" type real using ("value"::real);');

    this.addSql('alter table "metric" drop constraint if exists "team_metric_name_check";');
    this.addSql('alter table "metric" drop constraint if exists "metric_name_check";');
    this.addSql('alter table "metric" alter column "name" type text using ("name"::text);');

    this.addSql('update "metric" set name=\'clubMembershipCount\' where name=\'membershipCount\';');
    this.addSql('update "metric" set name=\'clubUniqueMembershipCount\' where name=\'uniqueMembershipCount\';');
    this.addSql('update "metric" set name=\'clubEventCount\' where name=\'eventCount\';');
    this.addSql('update "metric" set name=\'clubCreatedEventCount\' where name=\'createdEventCount\';');

    this.addSql('alter table "metric" add constraint "metric_name_check" check ("name" in (\'clubCount\', \'clubMembershipCount\', \'clubUniqueMembershipCount\', \'clubEventCount\', \'clubCreatedEventCount\'));');
  }

}
