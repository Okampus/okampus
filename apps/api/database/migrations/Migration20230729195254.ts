import { Migration } from '@mikro-orm/migrations';

export class Migration20230729195254 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team_metric" drop constraint if exists "team_metric_type_check";');

    this.addSql('alter table "team_metric" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_metric" add constraint "team_metric_type_check" check ("type" in (\'MemberInOrgAndChildrenCount\', \'MemberInOrgAndChildrenUniqueCount\', \'EventOccuringCount\', \'EventCreatedCount\', \'ProjectCreatedCount\', \'ContentCreatedCount\', \'ChildOrgCount\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "team_metric" drop constraint if exists "team_metric_type_check";');

    this.addSql('alter table "team_metric" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "team_metric" add constraint "team_metric_type_check" check ("type" in (\'MemberInOrgAndChildrenCount\', \'MemberInOrgAndChildrenUniqueCount\', \'MemberInOrgAndChildrenUniqueCount\', \'EventOccuringCount\', \'EventCreatedCount\', \'EventOccuringCount\', \'EventCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ProjectCreatedCount\', \'ContentCreatedCount\', \'ContentCreatedCount\', \'ChildOrgCount\'));');
  }

}
